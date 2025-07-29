require 'rails_helper'

RSpec.describe Availability, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
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
end
