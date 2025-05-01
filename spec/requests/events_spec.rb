require 'rails_helper'

RSpec.describe "EventsController", type: :request, inertia: true do
  # describe "GET /index" do
  #   pending "add some examples (or delete) #{__FILE__}"
  # end
  let(:valid_params) do
    {
      name: "Bar Hopping",
      dates: [ "2025-04-19T04:00:00.000Z", "2025-04-20T04:00:00.000Z", "2025-04-21T04:00:00.000Z" ],
      start_time: "7",
      end_time: "9",
      time_zone: "America/New_York"
    }
  end
  let(:user) { User.create!(name: "Varun", email_address: "varun@example.com", password: "password") }
  context "POST /events" do
    it "should create an event with valid params and logged in user" do
      allow(Current).to receive(:user).and_return(user)
      expect {
        post events_path, params: { event: valid_params }
      }.to change(Event, :count).by(1)
      follow_redirect!
      expect(inertia.component).to eq("Event/Show")
    end

    it "should show login/signup in event_path if user is not logged in" do
      allow(Current).to receive(:user).and_return(nil)
      expect {
        post events_path, params: { event: valid_params }
      }.to change(Event, :count).by(1)

      expect(response).to redirect_to(event_path(Event.last))
      follow_redirect!
      post session_path, params: { email_address: user.email_address, password: "password" }
      follow_redirect!
      expect(inertia.component).to eq("Event/Show")
      expect(inertia.props[:event].object.url).to eq(Event.last.url)
    end

    it("should redirect to new_registration_path if user doesn't have an account") do
      allow(Current).to receive(:user).and_return(nil)
      expect {
        post events_path, params: { event: valid_params }
      }.to change(Event, :count).by(1)
      expect(response).to redirect_to event_path(Event.last)
      follow_redirect!
      get new_registration_path
      expect(response).to have_http_status(:ok)
      expect(inertia.component).to eq("Auth/Signup")
      post registration_path, params: { name: "John", email_address: "john@example.com", password: "password" }
      follow_redirect!
      expect(inertia.component).to eq("Event/Show")
      expect(inertia.props[:event].object.url).to eq(Event.last.url)
    end
  end
  describe "PATCH /schedule" do
    before do
      post session_path, params: { email_address: user.email_address, password: "password" }
      post events_path, params: { event: valid_params }
    end
    it "creates the scheduled time slots and updates the status of the event" do
      time_slot_ids = [ Event.first.time_slots.first.id, Event.first.time_slots.second.id ]
      expect { patch schedule_event_path(url: Event.last.url), params: { slot_ids: time_slot_ids } }.to change(ScheduledSlot, :count).by(2)
      expect(Event.last.status).to eq("scheduled")
    end

    it "cannot create duplicate time slots and cannot update the event" do
      time_slot_ids = [ Event.first.time_slots.first.id, Event.first.time_slots.first.id ]
      patch schedule_event_path(url: Event.last.url), params: { slot_ids: time_slot_ids }

      expect(response.parsed_body[:errors]).to eq("Validation failed: Time slot has already been taken")
      expect(Event.last.status).to eq("created")
    end

    it "cannot create empty time slots and cannot update the event" do
      time_slot_ids = [ Event.first.time_slots.first.id, "" ]
      patch schedule_event_path(url: Event.last.url), params: { slot_ids: time_slot_ids }

      expect(response.parsed_body[:errors]).to eq("Validation failed: Time slot must exist")
      expect(Event.last.status).to eq("created")
    end
  end
end
