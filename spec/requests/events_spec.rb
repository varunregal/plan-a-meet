require 'rails_helper'

RSpec.describe "EventsController", type: :request, inertia: true do
  let!(:user) { create(:user) }
  let(:valid_event_params) do
    {
      name: "Bar Hopping",
      dates: [ "2025-04-19T04:00:00.000Z", "2025-04-20T04:00:00.000Z", "2025-04-21T04:00:00.000Z" ],
      start_time: "7",
      end_time: "9",
      time_zone: "America/New_York"
    }
  end

  describe "POST /events" do
    context "when user is logged in" do
      before do
        allow(Current).to receive(:user).and_return(user)
      end
      it "creates an event with valid params and redirects to event show page" do
        expect { post events_path, params: { event: valid_event_params } }.to change(Event, :count).by(1)
        follow_redirect!
        expect(inertia.component).to eq "Event/Show"
        expect(inertia.props[:event].object.name).to eq "Bar Hopping"
        expect(inertia.props[:event].object.time_slots.count).to eq(12)
      end

      it "cannot create an event with invalid params" do
        expect { post events_path, params: { event: valid_event_params.merge(name: "") } }.to change(Event, :count).by(0)
        expect(response).to redirect_to new_event_path
        follow_redirect!
        expect(inertia.props[:errors]["name"][0]).to eq "can't be blank"
      end
    end

    context "when user is not logged in" do
      before do
        allow(Current).to receive(:user).and_return(nil)
        post events_path, params: { event: valid_event_params }
        @created_event = Event.last
      end

      it "creates the event and redirects to the event page (prompting sign in/signup)" do
        expect(Event.count).to eq(1)
        expect(response).to redirect_to(event_path(@created_event))
        follow_redirect!
        post session_path, params: { email_address: user.email_address, password: "password" }
        follow_redirect!
        expect(inertia.component).to eq "Event/Show"
        expect(inertia.props[:event].object.url).to eq @created_event.url
      end

      it "creates the event and then the user sign up" do
        expect(Event.count).to eq(1)
        expect(response).to redirect_to(event_path(@created_event))
        follow_redirect!
        post registration_path, params: { name: "John", email_address: "john@example.com", password: "password" }
        follow_redirect!
        expect(inertia.component).to eq "Event/Show"
        expect(inertia.props[:event].object.url).to eq @created_event.url
      end
    end
  end

  describe "PATCH /schedule" do
    before do
      post session_path, params: { email_address: user.email_address, password: "password" }
      post events_path, params: { event: valid_event_params }
      @created_event = Event.last
      @time_slot_ids = [ @created_event.time_slots.first.id, @created_event.time_slots.second.id ]
    end

    it "creates the scheduled time slots and updates the status of the event" do
      expect { patch schedule_event_path(url: Event.last.url), params: { slot_ids: @time_slot_ids } }.to change(ScheduledSlot, :count).by(2)
      expect(Event.last.status).to eq("scheduled")
    end

    it "cannot create duplicate time slots and cannot update the event" do
      @time_slot_ids[1] = @created_event.time_slots.first.id
      patch schedule_event_path(url: Event.last.url), params: { slot_ids: @time_slot_ids }
      expect(response.parsed_body[:errors]).to eq("Validation failed: Time slot has already been taken")
      expect(Event.last.status).to eq("created")
    end

    it "cannot create empty time slots and cannot update the event" do
      @time_slot_ids[1] = ""
      patch schedule_event_path(url: Event.last.url), params: { slot_ids: @time_slot_ids }
      expect(response.parsed_body[:errors]).to eq("Validation failed: Time slot must exist")
      expect(Event.last.status).to eq("created")
    end
  end
end
