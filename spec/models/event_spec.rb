require 'rails_helper'

RSpec.describe Event, type: :model do
  describe "validations" do
    it "is valid with all attributes" do
      event = build(:event)
      expect(event).to be_valid
    end

    it "is not valid with no name" do
      event = Event.new(name: nil, url: 'abc123')
      expect(event).to be_invalid
    end

    it "is not valid with no url" do
      event = Event.new(name: 'Event 1', url: nil)
      expect(event).to be_invalid
    end

    it "check if the url is unique" do
      event1 = create(:event)
      event2 = build(:event)
      expect(event2).to be_invalid
    end

    it "enforce uniqueness of the url at database level" do
      create(:event)
      event2 = build(:event)
      expect {
        event2.save(validate: false)
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end
end
