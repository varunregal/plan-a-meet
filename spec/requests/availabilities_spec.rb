require 'rails_helper'

RSpec.describe "AvailabilitiesController", type: :request, inertia: true do
  # describe "GET /index" do
  #   pending "add some examples (or delete) #{__FILE__}"
  # end

  describe "POST /availabilities" do
    let(:event_params) do
      {
        name: "Bar Hopping",
        dates: [ "2025-04-19T04:00:00.000Z", "2025-04-20T04:00:00.000Z", "2025-04-21T04:00:00.000Z" ],
        start_time: "7",
        end_time: "9",
        time_zone: "America/New_York"
      }
    end
    let (:user) { User.create!(name: "Varun", email_address: "varun@example.com", password: "password") }
    before do
      post session_path, params: { email_address: user.email_address, password: "password" }
      allow(Current).to receive(:user).and_return(user)
      post events_path, params: { event: event_params }
      @time_slot = Event.last.time_slots.first
    end

    it "create availability with valid params" do
      expect { post time_slot_availability_path(@time_slot) }.to change(Availability, :count).by(1)
      expect(response.parsed_body["time_slot_id"]).to eq(@time_slot.id)
    end
    it "cannot create availability with invalid params" do
      expect { post time_slot_availability_path(305) }.to change(Availability, :count).by(0)
      expect(response.parsed_body["errors"]).to eq("Couldn't find TimeSlot with 'id'=#{305}")
    end

    it "cannot create availability with duplicate time slots" do
      expect { post time_slot_availability_path(@time_slot) }.to change(Availability, :count).by(1)
      expect { post time_slot_availability_path(@time_slot) }.to change(Availability, :count).by(0)
      expect(response.parsed_body["errors"]).to eq("Validation failed: Time slot has already been taken")
    end
  end
end
