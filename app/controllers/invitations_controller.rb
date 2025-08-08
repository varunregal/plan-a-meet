class InvitationsController < ApplicationController
  before_action :find_event
  before_action :authorize_event_creator

  def create
    email_addresses = check_valid_email_addresses(invitation_params[:email_addresses])
    return unless email_addresses

    successful_invitations = []
    failed_invitations = []
    email_addresses.each do |email_address|
      invitation = @event.invitations.build(email_address:, inviter: Current.user)
      if invitation.save
        successful_invitations << invitation
        InvitationMailer.invitation_email(invitation).deliver_later
      else
        failed_invitations << invitation
      end
    end

    if successful_invitations.any?
      redirect_to event_path(@event), notice: "Successfully sent #{successful_invitations.count} invitation(s)"
    else
      errors = failed_invitations.map(&:errors).map(&:full_messages).flatten
      redirect_back fallback_location: event_path(@event), inertia: { errors: { email_addresses: errors } }
    end
  end

  def verify
    invitation = @event.invitations.find_by!(invitation_token: params[:token])
    return unless invitation

    if params[:response] == 'accept'
      invitation.accept!
      redirect_to event_path(@event.url), notice: 'Please add your availability'
    elsif params[:response] == 'reject'
      invitation.decline!
      render inertia: 'Invitation/Decline'
    else
      redirect_to root_path, alert: 'Something went wrong. Please try again.'
    end
  end

  private

  def find_event
    @event = Event.find_by(url: params[:event_url])
  end

  def authorize_event_creator
    head :forbidden unless @event.event_creator == Current.user
  end

  def invitation_params
    params.permit(email_addresses: [])
  end

  def check_valid_email_addresses(email_addresses)
    valid_email_addresses = email_addresses.compact_blank
    if valid_email_addresses.empty?
      redirect_back fallback_location: event_path(@event),
                    inertia: { errors: { email_addresses: ['Please provide at least one email address'] } }
      return nil
    end
    valid_email_addresses
  end
end
