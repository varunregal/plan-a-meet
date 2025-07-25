require 'rails_helper'

RSpec.describe InvitationMailer, type: :mailer do
  describe 'invitation_email' do
    let(:invitation) { create(:invitation) }
    let(:mail) { described_class.invitation_email(invitation) }

    it 'renders the headers' do
      expect(mail.subject).to eq "You're invited to #{invitation.event.name}"
      expect(mail.to).to eq([invitation.email_address])
      # expect(mail.from).to eq(['notifications@planameet.com'])
    end

    it "includes the inviter's name in the body" do
      expect(mail.body.encoded).to match(invitation.inviter.name)
    end

    it 'includes the invitation link with token' do
      expect(mail.body.encoded).to match(invitation.invitation_token)
    end
  end
end
