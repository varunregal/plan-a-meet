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
      event1 = create(:event)
      event2 = create(:event)
      event3 = create(:event)

      pending_invitation = create(:invitation,
                                  event: event1,
                                  email_address: 'john@example.com',
                                  invitee: nil,
                                  status: 'pending')
      create(:invitation,
             event: event2,
             email_address: 'john@example.com',
             invitee: user,
             status: 'pending')
      create(:invitation,
             event: event3,
             email_address: 'other@example.com',
             invitee: nil)
      expect(user.pending_invitations_by_email).to contain_exactly pending_invitation
    end
  end

  describe '#link_pending_invitations!' do
    it 'links pending invitations to the user' do
      user = create(:user, email_address: 'john@example.com')
      event1 = create(:event)
      event2 = create(:event)

      invitation1 = create(:invitation,
                           event: event1,
                           email_address: 'john@example.com',
                           invitee: nil)

      invitation2 = create(:invitation,
                           event: event2,
                           email_address: 'john@example.com',
                           invitee: nil)

      user.link_pending_invitations!

      invitation1.reload
      invitation2.reload

      expect(invitation1.invitee).to eq(user)
      expect(invitation2.invitee).to eq(user)
    end

    it 'only links invitations with matching email' do
      user = create(:user, email_address: 'john@example.com')
      event = create(:event)

      other_invitation = create(:invitation,
                                event: event,
                                email_address: 'other@example.com',
                                invitee: nil)

      user.link_pending_invitations!

      other_invitation.reload
      expect(other_invitation.invitee).to be_nil
    end
  end
end
