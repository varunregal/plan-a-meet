require 'pry'
require 'rails_helper'

RSpec.describe 'SessionsController', :inertia, type: :request do
  describe 'GET /session' do
    it 'renders sign in page' do
      get new_session_path
      expect(response).to have_http_status(:ok)
      expect(inertia.component).to eq 'Auth/Login'
    end
  end

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
        post session_path, params: valid_params
        expect(response).to redirect_to(profile_path)
        follow_redirect!
        expect(inertia.props[:flash]['notice']).to eq('Signed in successfully!')
        expect(inertia.component).to eq('Profile/Show')
      end
    end

    context 'with invalid params' do
      it('rejects a new email') do
        modified_params = valid_params.merge(email_address: 'john@example.com')
        post session_path, params: modified_params
        follow_redirect!
        expect(inertia.component).to eq('Auth/Login')
        inertia_props = inertia.props.deep_symbolize_keys
        expect(inertia_props[:errors][:base][0]).to eq('Invalid email or password')
      end

      it('rejects empty password') do
        modified_params = valid_params.merge(password: '')
        post session_path, params: modified_params
        follow_redirect!
        expect(inertia.component).to eq('Auth/Login')
        inertia_props = inertia.props.deep_symbolize_keys
        expect(inertia_props[:errors][:base][0]).to eq('Invalid email or password')
      end
    end

    context 'when redirect authenticated users from sign in page' do
      it('redirect to profile path') do
        post session_path, params: valid_params
        follow_redirect!
        get new_session_path
        expect(response).to redirect_to(profile_path)
      end
    end

    context 'when rate limit registrations' do
      it 'rate-limit after 10 tries' do
        10.times do |i|
          User.create!(valid_params.merge(email_address: "user#{i}@example.com", name: 'user'))
          post session_path, params: valid_params.merge(email_address: "user#{i}@example.com")
          delete session_path
        end
        User.create!(valid_params.merge(email_address: 'user11@example.com', name: 'user'))
        post session_path, params: valid_params.merge(email_address: 'user11@example.com')
        follow_redirect!
        inertia_props = inertia.props.deep_symbolize_keys
        expect(inertia_props[:flash][:alert]).to eq('Too many attempts. Please try again later.')
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
        }
        expect(response).to redirect_to(profile_path)
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
