require 'rails_helper'
RSpec.describe 'User', type: :model do
  describe 'associations' do
    it 'has many sent invitations' do
      user = create(:user)
      invitation = create(:invitation, inviter: user)
      expect(user.sent_invitations).to include(invitation)
    end

    it 'has many received invitations' do
      user = create(:user)
      invitation = create(:invitation, invitee: user)
      expect(user.received_invitations).to include(invitation)
    end
  end

  describe '#pending_invitations_by_email' do
    it "returns pending invitations matching user's email" do
      user = create(:user, email_address: 'john@example.com')
      event = create(:event)

      pending_invitation = create(:invitation,
                                  event:,
                                  email_address: 'john@example.com',
                                  invitee: nil,
                                  status: 'pending')
      create(:invitation,
             event:,
             email_address: 'john@example.com',
             invitee: user,
             status: 'pending')
      create(:invitation,
             event:,
             email_address: 'other@example.com',
             invitee: nil)
      expect(user.pending_invitations_by_email).to contain_exactly pending_invitation
    end
  end
end
