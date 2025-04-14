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
        end_time: "10"
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
      expect(first_slot.start_time.hour).to eq(9)
      expect(first_slot.end_time.hour).to eq(9)
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
  end
end
