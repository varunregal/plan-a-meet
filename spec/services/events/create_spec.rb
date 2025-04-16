require 'rails_helper'
require "pry"
RSpec.describe Events::Create do
  describe "#create_time_slots_and_event" do
    let (:params) do
      {
        name: "Bar Hopping",
        start_date: "2025-04-08T21:53:04.295Z",
        end_date: "2025-04-08T21:53:04.295Z",
        start_time: "9",
        end_time: "10",
        time_zone: "America/New_York"
      }
    end


    it "event is saved successfully" do
      service = described_class.new(params)
      result = service.create_time_slots_and_event

      expect(result.success?).to be true
      expect(result.data).to be_a(Event)
      expect(result.data.name).to eq("Bar Hopping")
      expect(result.data.time_slots.count).to eq(2)

      first_slot = result.data.time_slots.first
      expect(first_slot.start_time.hour).to eq(13) # UTC time
      expect(first_slot.end_time.hour).to eq(13)
      expect(first_slot.end_time.min).to eq(30)
    end

    it "validation error when name is empty" do
      modified_params = params.merge(name: "")
      service = described_class.new(modified_params)


      expect { @result = service.create_time_slots_and_event }.not_to change(Event, :count)
      expect(@result.success?).to be false
      expect(@result.data).to be_nil
      expect(@result.error).to be_a(ActiveRecord::RecordInvalid)
    end

    it "end_time is before start_time" do
      modified_params = params.merge(end_time: "8")
      service = described_class.new(modified_params)
      expect { @result = service.create_time_slots_and_event }.not_to change(Event, :count)
    end

    it "check if the urls are different" do
      first_service = described_class.new(params)
      second_service= described_class.new(params.merge(name: "Team Lunch"))
      first_event = first_service.create_time_slots_and_event
      second_event = second_service.create_time_slots_and_event
      expect(first_event.data.url).not_to eq(second_event.data.url)
      expect(first_event.data.url).to match(/^[A-Za-z0-9_]+$/)
      expect(Event.count).to eq(2)
    end

    it "two different dates at the midnight" do
      modified_params = params.merge(start_date: "2025-04-08", end_date: "2025-04-09", start_time: "23", end_time: "1")
      service = described_class.new(modified_params)
      event = service.create_time_slots_and_event
      expect(event.data.time_slots.count).to eq(4)
    end
  end
end
