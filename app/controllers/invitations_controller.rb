class InvitationsController < ApplicationController
  before_action :find_event
  before_action :authorize_event_creator
  def create
    email_addresses = invitation_params[:email_addresses]
    invitations = []
    email_addresses.each do |email_address|
      invitation = @event.invitations.create(email_address:, inviter: Current.user)
      invitations << invitation if invitation.persisted?
    end
    if invitations.any?
      redirect_to event_path(@event), notice: "Successfully sent #{invitations.count} invitation(s)"
    else
      redirect_to event_path(@event), alert: 'Failed to send invitations'
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
    params.require(:invitation).permit(email_addresses: [])
  end
end
