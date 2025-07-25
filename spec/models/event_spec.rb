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
end
