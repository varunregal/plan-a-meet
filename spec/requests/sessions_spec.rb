require 'pry'
require 'rails_helper'

RSpec.describe 'SessionsController', :inertia, type: :request do
  describe 'DELETE /session' do
    let(:valid_params) do
      { email_address: 'varun@example.com', password: 'password' }
    end

    before { User.create!(valid_params.merge(name: 'Varun')) }

    it 'redirects user to root_path after logout' do
      post session_path, params: valid_params
      follow_redirect!
      delete session_path
      expect(response).to redirect_to root_path
      follow_redirect!
      expect(inertia.component).to eq('Event/New')
    end
  end

  describe 'POST /session' do
    let(:valid_params) do
      { email_address: 'varun@example.com', password: 'password' }
    end

    before { User.create!(valid_params.merge(name: 'Varun')) }

    context 'with valid params' do
      it('creates a user with valid params') do
        post session_path, params: valid_params, headers: { 'HTTP_REFERER' => root_path }

        expect(response).to redirect_to root_path
      end

      it 'redirects to root when no referer' do
        post session_path, params: valid_params
        expect(response).to redirect_to(root_path)
      end
    end

    context 'with invalid params' do
      it('rejects a new email') do
        modified_params = valid_params.merge(email_address: 'john@example.com')
        post session_path, params: modified_params, headers: { 'HTTP_REFERER' => root_path }
        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(inertia.props[:errors]['base']).to eq('Invalid email or password')
      end

      it 'rejects empty password' do
        modified_params = valid_params.merge(password: '')
        post session_path, params: modified_params, headers: { 'HTTP_REFERER' => root_path }
        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(inertia.props[:errors]['base']).to eq('Invalid email or password')
      end
    end

    context 'when rate limit registrations' do
      it 'rate-limit after 10 tries' do
        10.times do |i|
          User.create!(valid_params.merge(email_address: "user#{i}@example.com",
                                          name: 'user'))
          post session_path, params: valid_params.merge(email_address: "user#{i}@example.com"),
                             headers: { 'HTTP_REFERER' => root_path }
          delete session_path if response.redirect?
        end

        User.create!(valid_params.merge(email_address: 'user11@example.com',
                                        name: 'user'))
        post session_path, params: valid_params.merge(email_address: 'user11@example.com'),
                           headers: { 'HTTP_REFERER' => root_path }

        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(inertia.props[:errors]['base']).to eq('Too many attempts. Please try again later.')
      end
    end

    context 'when anonymous user signs in' do
      let!(:user) { create(:user, :john) }

      it 'converts anonymous events to authenticated' do
        post events_path, params: {
          name: 'Anonymous Event',
          dates: ['2025-08-01'],
          start_time: '09:00',
          end_time: '10:00',
          time_zone: 'America/New_York'
        }

        anonymous_event = Event.last

        post session_path, params: {
          email_address: 'john@example.com',
          password: 'password'
        }, headers: { 'HTTP_REFERER' => root_path }
        expect(response).to redirect_to(root_path)
        anonymous_event.reload
        expect(anonymous_event.event_creator).to eq(user)
        expect(anonymous_event.anonymous_session_id).to be_nil
      end

      it 'clears anonymous session cookie after sign in' do
        post events_path, params: {
          name: 'Anonymous Event',
          dates: ['2025-08-01'],
          start_time: '09:00',
          end_time: '10:00',
          time_zone: 'America/New_York'
        }

        jar = ActionDispatch::Cookies::CookieJar.build(request, cookies.to_hash)
        expect(jar.signed[:anonymous_session_id]).to be_present
        post session_path, params: { email_address: 'john@example.com', password: 'password' }
        jar = ActionDispatch::Cookies::CookieJar.build(request, cookies.to_hash)
        expect(jar.signed[:anonymous_session_id]).to be_nil
      end
    end
  end
end
