class InvitationMailer < ApplicationMailer
  def invitation_email(invitation)
    @invitation = invitation
    mail(
      to: invitation.email_address,
      subject: "You're invited to #{invitation.event.name}"
    )
  end
end
