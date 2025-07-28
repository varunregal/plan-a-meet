require 'pry'
require 'rails_helper'

RSpec.describe 'RegistrationsController', :inertia, type: :request do
  describe 'POST /registration' do
    let(:user) { attributes_for(:user) }

    context 'with valid parameters' do
      let(:user_params) do
        {
          name: 'John Doe',
          email_address: 'john@example.com',
          password: 'password'
        }
      end

      it 'creates a new user' do
        expect do
          post registration_path, params: user_params
        end.to change(User, :count).by(1)
        expect(response).to redirect_to(profile_path)
      end

      it 'logs the user in after registration' do
        post registration_path, params: user_params
        expect(Session.count).to eq(1)
        session = Session.first
        expect(session.user.email_address).to eq('john@example.com')
        expect(cookies[:session_id]).to be_present
      end
    end

    context 'with invalid parameters' do
      it 'does not create user with missing name' do
        expect do
          post registration_path, params: user.merge(name: '')
        end.not_to change(User, :count)
        expect(response).to redirect_to(new_registration_path)
        follow_redirect!
        expect(inertia.props[:errors]['name']).to include("Name can't be blank")
      end

      it 'renders signup page with errors when email is missing' do
        new_invalid_params = user.merge(email_address: '')
        post registration_path, params: new_invalid_params
        expect(response).to redirect_to(new_registration_path)
        follow_redirect!
        expect(inertia.props[:errors]['email_address']).to include("Email address can't be blank")
      end

      it 'renders signup page with errors when password is too short' do
        new_invalid_params = user.merge(password: '12345')
        post registration_path, params: new_invalid_params
        expect(response).to redirect_to(new_registration_path)
        follow_redirect!
        expect(inertia.props[:errors]['password']).to include('Password is too short (minimum is 8 characters)')
      end
    end

    context 'with duplicate email' do
      it 'redirects with error message when email already exists' do
        create(:user, email_address: 'john@example.com')
        duplicate_params = user.merge(email_address: 'john@example.com')
        post registration_path, params: duplicate_params
        expect(response).to redirect_to(new_registration_path)
        follow_redirect!
        expect(inertia.props[:errors]['email_address']).to include('Email address has already been taken')
      end
    end

    context 'when rate limiting' do
      it 'handles too many registration attempts' do
        11.times do |i|
          user_params = user.merge(email_address: "test#{i}@example.com")
          post registration_path, params: user_params
        end
        expect(response).to redirect_to(new_registration_path)
        expect(flash[:alert]).to eq('Too many registration attempts. Please try again later')
      end
    end

    context 'when anonymous user signs up' do
      let(:user_params) do
        {
          name: 'John Doe',
          email_address: 'john@example.com',
          password: 'password123'
        }
      end

      it 'converts anonymous events to authenticated' do
        post events_path, params: {
          name: 'Anonymous Event',
          dates: ['2025-08-01'],
          start_time: '09:00',
          end_time: '10:00',
          time_zone: 'America/New_York'
        }

        anonymous_event = Event.last
        expect(anonymous_event.anonymous_session_id).to be_present
        post registration_path, params: user_params
        user = User.last
        anonymous_event.reload
        expect(anonymous_event.event_creator).to eq user
        expect(anonymous_event.anonymous_session_id).to be_nil
      end

      # it 'converts anonymous availabilities to authenticated' do
      #   event = create(:event)
      #   time_slot = create(:time_slot, event:)
      #   # TODO
      # end

      it 'when coming from a specific page redirects back to that page after sign up' do
        event = create(:event)
        get event_path(event)

        post registration_path, params: user_params, headers: { 'HTTP_REFERER' => event_url(event) }
        expect(response).to redirect_to(event_path(event))
      end

      it 'clears the anonymous session cookie after sign up' do
        post events_path, params: {
          name: 'Anonymous Event',
          dates: ['2025-08-01'],
          start_time: '09:00',
          end_time: '10:00',
          time_zone: 'America/New_York'
        }

        jar = ActionDispatch::Cookies::CookieJar.build(request, cookies.to_hash)
        expect(jar.signed[:anonymous_session_id]).to be_present
        post registration_path, params: user_params

        jar = ActionDispatch::Cookies::CookieJar.build(request, cookies.to_hash)
        expect(jar.signed[:anonymous_session_id]).to be_nil
      end

      it 'redirects to profile path when not coming from a specific page' do
        post events_path, params: {
          name: 'Anonymous Event',
          dates: ['2025-08-01'],
          start_time: '09:00',
          end_time: '10:00',
          time_zone: 'America/New_York'
        }

        post registration_path, params: user_params
        expect(response).to redirect_to(profile_path)
        expect(flash[:notice]).to eq 'Successfully signed up!'
      end
    end

    context 'when no anonymous session exists' do
      let(:user_params) do
        {
          name: 'John Doe',
          email_address: 'john@example.com',
          password: 'password123'
        }
      end

      it 'completes registration normally' do
        expect { post registration_path, params: user_params }.to change(User, :count).by(1)
        expect(response).to redirect_to(profile_path)
      end
    end
  end
end
