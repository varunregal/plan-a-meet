require 'rails_helper'

RSpec.describe TimeSlot, type: :model do
  describe "validations" do
    it "is valid with all attributes" do
      event = create(:event)
      time_slot = TimeSlot.new(start_time: Time.zone.now, end_time: 30.minutes.from_now, event: event)
      expect(time_slot).to be_valid
    end

    it("is invalid without start time") do
      event = create(:event)
      time_slot = TimeSlot.new(start_time: nil, end_time: Time.zone.now, event: event)
      expect(time_slot).to be_invalid
    end

    it("is invalid without end time") do
      event = create(:event)
      time_slot = TimeSlot.new(start_time: Time.zone.now, end_time: nil, event: event)
      expect(time_slot).to be_invalid
    end

    it("is invalid without event_id") do
      time_slot = TimeSlot.new(start_time: Time.zone.now, end_time: 30.minutes.from_now, event: nil)
      expect(time_slot).to be_invalid
    end

      it("is invalid if end_time < start_time") do
      event = create(:event)
      time_slot = TimeSlot.new(start_time: Time.zone.now, end_time: 30.minutes.ago, event: event)
      time_slot.valid?
      expect(time_slot.errors[:start_time]).to include("start time must be earlier than end time")
    end
  end
end
