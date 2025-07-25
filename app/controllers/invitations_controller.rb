class InvitationsController < ApplicationController
  before_action :find_event
  before_action :authorize_event_creator

  def create
    email_addresses = check_valid_email_addresses(invitation_params[:email_addresses])
    return unless email_addresses

    invitations = email_addresses.map do |email_address|
      @event.invitations.build(email_address:, inviter: Current.user)
    end

    if invitations.all?(&:save)
      redirect_to event_path(@event), notice: "Successfully sent #{invitations.count} invitation(s)"
    else
      errors = invitations.map(&:errors).map(&:full_messages).flatten
      redirect_back fallback_location: event_path(@event), inertia: { errors: { email_addresses: errors } }
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
