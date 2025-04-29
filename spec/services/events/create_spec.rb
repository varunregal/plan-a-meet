require 'rails_helper'
require "pry"
RSpec.describe Events::Create do
  describe "#create_time_slots_and_event" do
    let (:params) do
      {
        name: "Bar Hopping",
        dates: [ "2025-04-19T04:00:00.000Z", "2025-04-20T04:00:00.000Z", "2025-04-21T04:00:00.000Z" ],
        start_time: "7",
        end_time: "9",
        time_zone: "America/New_York"
      }
    end

    before { @user = User.create!(name: "Varun", email_address: "varun@example.com", password: "password") }

    it "event is saved successfully" do
      service = described_class.new(params, current_user: @user)
      result = service.create_time_slots_and_event

      expect(result.success?).to be true
      expect(result.data).to be_a(Event)
      expect(result.data.name).to eq("Bar Hopping")
      expect(result.data.time_slots.count).to eq(12)
      expect(result.data.event_creator.name).to eq("Varun")

      first_slot = result.data.time_slots.first
      expect(first_slot.start_time.hour).to eq(11) # UTC time
      expect(first_slot.end_time.hour).to eq(11)
      expect(first_slot.end_time.min).to eq(30)
    end

    it "event is created even if current user is nil" do
      service = described_class.new(params, current_user: nil)
      result = service.create_time_slots_and_event

      expect(result.success?).to be true
      expect(result.data).to be_a(Event)
      expect(result.data.event_creator).to be_nil
    end

    it "validation error when name is empty" do
      modified_params = params.merge(name: "")
      service = described_class.new(modified_params, current_user: @user)


      expect { @result = service.create_time_slots_and_event }.not_to change(Event, :count)
      expect(@result.success?).to be false
      expect(@result.data).to be_nil
      expect(@result.error).to be_a(ActiveRecord::RecordInvalid)
    end

    it "end_time is before start_time" do
      modified_params = params.merge(end_date: "2025-04-19", end_time: "6")
      service = described_class.new(modified_params, current_user: @user)
      expect { @result = service.create_time_slots_and_event }.not_to change(Event, :count)
    end

    it "check if the urls are different" do
      first_service = described_class.new(params, current_user: @user)
      second_service= described_class.new(params.merge(name: "Team Lunch"), current_user: @user)
      first_event = first_service.create_time_slots_and_event
      second_event = second_service.create_time_slots_and_event
      expect(first_event.data.url).not_to eq(second_event.data.url)
      expect(first_event.data.url).to match(/\A[a-zA-Z0-9_\-]+\z/)
      expect(Event.count).to eq(2)
    end
  end
end
