require 'rails_helper'

RSpec.describe Availability, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user).optional }
    it { is_expected.to belong_to(:time_slot) }
  end

  describe 'validations' do
    subject { build(:availability, user:, time_slot:) }

    let(:user) { create(:user) }
    let(:event) { create(:event) }
    let(:time_slot) { create(:time_slot, event:) }

    it { is_expected.to validate_uniqueness_of(:time_slot_id).scoped_to(:user_id) }

    it 'prevents a user from marking the same time slot twice' do
      availability1 = create(:availability, user:, time_slot:)
      expect(availability1).to be_valid

      availability2 = build(:availability, user:, time_slot:)
      expect(availability2).not_to be_valid
      expect(availability2.errors[:time_slot_id]).to include('has already been taken')
    end

    it 'allows different users to mark the same time slot' do
      user2 = create(:user)
      create(:availability, user:, time_slot:)
      availability2 = create(:availability, user: user2, time_slot:)
      expect(availability2).to be_valid
    end
  end

  describe 'anonymous user validations' do
    let(:event) { create(:event) }
    let(:time_slot) { create(:time_slot, event:) }

    context 'when neither user nor anonymous_session_id is present' do
      it 'is invalid' do
        availability = build(:availability, user: nil, anonymous_session_id: nil, time_slot:)
        expect(availability).not_to be_valid
        expect(availability.errors[:base]).to include 'Either user or anonymous session must be present'
      end
    end

    context 'when anonymous_session_id is present' do
      it 'requires participant_name' do
        availability = build(:availability,
                             user: nil,
                             anonymous_session_id: 'abc123',
                             participant_name: nil,
                             time_slot:)
        expect(availability).not_to be_valid
        expect(availability.errors[:participant_name]).to include 'is required for anonymous users'
      end

      it 'is valid with participant_name' do
        availability = build(:availability,
                             user: nil,
                             anonymous_session_id: 'abc123',
                             participant_name: 'John Doe',
                             time_slot:)
        expect(availability).to be_valid
      end
    end
  end
end
