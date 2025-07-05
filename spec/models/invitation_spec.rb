require 'rails_helper'

RSpec.describe Invitation, type: :model do
  let(:event) { create(:event) }
  let(:inviter) { create(:user) }
  let(:invitee) { create(:user, :john) }

  describe 'association' do
    it { is_expected.to belong_to(:event) }
    it { is_expected.to belong_to(:inviter).class_name('User') }
    it { is_expected.to belong_to(:invitee).class_name('User').optional }
  end

  describe 'validations' do
    subject(:invitation) { build(:invitation, event:, inviter:) }

    it { is_expected.to validate_presence_of(:email_address) }
    it { is_expected.to validate_inclusion_of(:status).in_array(%w[pending accepted declined]) }

    it 'validates uniqueness of email_address scoped to event_id' do
      create(:invitation, event:, inviter:, email_address: 'test@example.com')
      duplicate = build(:invitation, event:, inviter:, email_address: 'test@example.com')
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:email_address]).to include('has already been invited to this event')
    end

    it 'allows same email for different events' do
      other_event = create(:event)
      create(:invitation, event:, inviter:, email_address: 'test@example.com')
      different_event_invitation = build(:invitation, event: other_event, inviter:, email_address: 'test@example.com')
      expect(different_event_invitation).to be_valid
    end

    it 'generates invitation_token automatically' do
      expect(invitation.invitation_token).to be_nil
      invitation.save!
      expect(invitation.invitation_token).to be_present
    end

    it 'normalizes email address' do
      invitation = create(:invitation, event:, inviter:, invitee:, email_address: ' TEST1@EXAMPLE.COM')
      expect(invitation.email_address).to eq('test1@example.com')
    end
  end

  describe 'scopes' do
    let!(:pending_invitation) do
      create(:invitation, event:, inviter:, invitee:, status: 'pending', email_address: 'pending@example.com')
    end
    let!(:accepted_invitation) do
      create(:invitation, event:, inviter:, invitee:, status: 'accepted', email_address: 'accepted@example.com')
    end

    it 'returns pending invitations' do
      expect(described_class.pending).to include(pending_invitation)
      expect(described_class.pending).not_to include(accepted_invitation)
    end

    it 'returns accepted invitations' do
      expect(described_class.accepted).to include(accepted_invitation)
      expect(described_class.accepted).not_to include(pending_invitation)
    end
  end

  describe '#accept!' do
    let(:invitation) { create(:invitation, event:, inviter:, status: 'pending') }

    it 'marks invitation as accepted and sets invitee' do
      invitation.accept!(invitee)
      expect(invitation.status).to eq('accepted')
      expect(invitation.invitee).to eq(invitee)
    end
  end

  describe '#decline!' do
    let(:invitation) { create(:invitation, event:, inviter:, status: 'pending') }

    it 'marks invitation as declined' do
      invitation.decline!
      expect(invitation.status).to eq('declined')
    end
  end
end
