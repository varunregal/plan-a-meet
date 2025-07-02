require "pry"
require "rails_helper"


RSpec.describe "RegistrationsController", type: :request, inertia: true do
  describe "POST /registration" do
    let(:user) { attributes_for(:user) }
    context "with valid parameters" do
      let(:user_params) do
        {
          name: 'John Doe',
          email_address: 'john@example.com',
          password: 'password'
        }
      end

      it 'creates a new user' do
        expect {
          post registration_path, params: user_params
        }.to change(User, :count).by(1)
        expect(response).to redirect_to(root_path)
      end

      it 'logs the user in after registration' do
        post registration_path, params: user_params
        expect(Session.count).to eq(1)
        session = Session.first
        expect(session.user.email_address).to eq('john@example.com')
        expect(cookies[:session_id]).to be_present
      end
    end

    context "with invalid parameters" do
      it 'does not create user with missing name' do
        expect {
          post registration_path, params: user.merge(name: "")
      }.not_to change(User, :count)
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
        duplicate_params = user.merge(email_address: "john@example.com")
        post registration_path, params: duplicate_params
        expect(response).to redirect_to(new_registration_path)
        follow_redirect!
        expect(inertia.props[:errors]['email_address']).to eq("Email address has already been taken")
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

    context "when user has created an event before registration" do
      before do
        post events_path, params: {
          event: {
            name: "Birthday Party",
            dates: [ "2025-04-19" ],
            start_time: "10",
            end_time: "12",
            time_zone: "America/New_York"
          }
        }
        @created_event = Event.last
      end

      it "assigns the user as event creator after registration" do
        post registration_path, params: user
        expect(@created_event.reload.event_creator).to eq(User.last)
        expect(response).to redirect_to(event_path(@created_event))
      end

      it 'shows correct success message when user becomes user creator' do
        post registration_path, params: user
        expect(flash[:notice]).to eq("Thanks for signing up! This event is now yours.")
      end
    end
    context "when user visits event page before registration" do
      let(:existing_event) { Event.create(name: 'Birthday Party', url: 'event-12444') }

      before do
        get event_path(existing_event)
      end

      it "redirects to event page after registration" do
        post registration_path, params: user

        expect(response).to redirect_to(event_path(existing_event))
        expect(existing_event.reload.event_creator).to be_nil
      end
    end
  end
end
