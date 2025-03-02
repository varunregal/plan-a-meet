require 'rails_helper'

RSpec.describe TimeSlot, type: :model do
  describe "validations" do
    it "is valid with all attributes" do
      event = create(:event)
      time_slot = TimeSlot.new(start_time: Time.now-30.minutes, end_time: Time.now, event: event)
      expect(time_slot).to be_valid
    end
  end
end
