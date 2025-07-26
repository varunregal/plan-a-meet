require 'rails_helper'
RSpec.describe Event, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:time_slots).dependent(:destroy) }
    it { is_expected.to have_many(:availabilities).through(:time_slots) }
    it { is_expected.to have_many(:scheduled_slots).dependent(:destroy) }
    it { is_expected.to have_many(:invitations).dependent(:destroy) }
    it { is_expected.to belong_to(:event_creator).class_name('User').optional }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }

    context 'with uniqueness' do
      subject { create(:event) }

      it { is_expected.to validate_uniqueness_of(:url) }
    end
  end

  describe 'url token generation' do
    it 'generates a url token on create' do
      event = described_class.create(name: 'Test Event')
      expect(event.url).to be_present
      expect(event.url).to match(/^[a-z0-9]{8}$/)
    end

    it 'does not require url to be set manually' do
      event = described_class.new(name: 'Test Event')
      expect(event).to be_valid
      event.save
      expect(event.url).to be_present
    end
  end

  describe '#to_param' do
    it 'returns the url token' do
      event = create(:event)
      expect(event.to_param).to eq(event.url)
    end
  end

  describe '#create_time_slots' do
    let(:event) { create(:event) }
    let(:dates) { ['2025-08-01'] }
    let(:start_time) { '09:00' }
    let(:end_time) { '10:00' }
    let(:time_zone) { 'America/New_York' }

    it 'creates time slots for a single date' do
      expect do
        event.create_time_slots(dates:, start_time:, end_time:, time_zone:)
      end.to change { event.time_slots.count }.by(4)
    end

    it 'stores times in UTC in the database' do
      event.create_time_slots(dates:, start_time:, end_time:, time_zone:)
      first_slot = event.time_slots.first

      expect(first_slot.start_time.utc.strftime('%H:%M')).to eq '13:00'
      expect(first_slot.end_time.utc.strftime('%H:%M')).to eq '13:15'
    end

    it 'handles different time zones correctly' do
      event.create_time_slots(dates:, start_time:, end_time:, time_zone: 'America/Los_Angeles')

      pacific_slot = event.time_slots.first
      expect(pacific_slot.start_time.utc.strftime('%H:%M')).to eq('16:00')

      event.time_slots.destroy_all

      event.create_time_slots(dates:, start_time:, end_time:, time_zone: 'Asia/Tokyo')
      tokyo_slot = event.time_slots.first
      expect(tokyo_slot.start_time.utc.strftime('%H:%M')).to eq('00:00')
    end
  end
end
