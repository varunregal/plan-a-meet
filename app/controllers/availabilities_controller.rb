class AvailabilitiesController < ApplicationController
  allow_unauthenticated_access only: %i[index create]
  def index
    event = Event.find_by!(url: params[:event_url])
    render json: {
      availability_data: build_availability_data(event),
      current_user_slots: current_user_time_slots(event),
      total_event_participants: unique_participant_count(event),
      participants: build_participants_data(event)

    }
  end

  def create
    return render_validation_error unless valid_create_params?

    event = Event.find_by!(url: params[:event_url])
    time_slot_ids = sanitized_time_slot_ids
    ActiveRecord::Base.transaction do
      create_availabilities(event, time_slot_ids)
    end
    head :ok
  rescue ActiveRecord::RecordNotFound
    render json: { errors: { time_slot_ids: ['contains invalid time slot'] } }, status: :unprocessable_entity
  end

  private

  def build_availability_data(event)
    availabilities_for_event(event).each_with_object({}) do |availability, hash|
      key = time_slot_key(availability.time_slot)
      hash[key] ||= []
      hash[key] << participant_name(availability)
    end
  end

  def availabilities_for_event(event)
    Availability.joins(:time_slot).where(time_slots: { event_id: event.id }).includes(:user, :time_slot)
  end

  def time_slot_key(slot)
    event_timezone = slot.event.time_zone || 'UTC' # TODO: add test cases for time zone
    time_in_zone = slot.start_time.in_time_zone(event_timezone)
    date_key = time_in_zone.strftime('%a %b %d %Y')
    hour = time_in_zone.hour
    minute = time_in_zone.min
    "#{date_key}-#{hour}-#{minute}"
  end

  def participant_name(availability)
    availability.user ? availability.user.name : availability.participant_name
  end

  def current_user_time_slots(event)
    return current_user_authenticated_slots(event) if authenticated?
    return current_user_anonymous_slots(event) if cookies.signed[:anonymous_session_id].present?

    []
  end

  def current_user_authenticated_slots(event)
    Current.user.availabilities
           .joins(:time_slot)
           .where(time_slots: { event_id: event.id })
           .pluck(:time_slot_id)
  end

  def current_user_anonymous_slots(event)
    Availability.joins(:time_slot)
                .where(time_slots: { event_id: event.id })
                .where(anonymous_session_id: cookies.signed[:anonymous_session_id])
                .pluck(:time_slot_id)
  end

  def unique_participant_count(event)
    event.availabilities
         .select('DISTINCT COALESCE(user_id::text, anonymous_session_id)')
         .count
  end

  def build_participants_data(event)
    participants = []
    responded_emails = Set.new
    participants.concat(build_authenticated_participants(event, responded_emails))
    participants.concat(build_anonymous_participants(event))
    participants.concat(build_invited_participants(event, responded_emails))
    participants
  end

  def build_authenticated_participants(event, responded_emails)
    participants = []
    availabilities_by_user = event.availabilities.includes(:user, :time_slot).group_by(&:user_id)
    availabilities_by_user.each do |user_id, user_availabilities|
      next unless user_id

      user = user_availabilities.first.user
      responded_emails.add(user.email_address) if user.email_address
      slot_ids = user_availabilities.map(&:time_slot_id)
      participants << {
        id: "user_#{user.id}",
        name: user.name,
        responded: true,
        slot_ids: slot_ids
      }
    end
    participants
  end

  def build_anonymous_participants(event)
    participants = []
    anonymous_availabilities = event.availabilities
                                    .where(user_id: nil).where.not(anonymous_session_id: nil)
                                    .includes(:time_slot).group_by(&:anonymous_session_id)
    anonymous_availabilities.each do |session_id, anon_availabilities|
      participant_name = anon_availabilities.first.participant_name
      slot_ids = anon_availabilities.map(&:time_slot_id)

      participants << {
        id: "anon_#{session_id}",
        name: participant_name,
        responded: true,
        slot_ids: slot_ids
      }
    end
    participants
  end

  def build_invited_participants(event, responded_emails)
    participants = []
    event.invitations.each do |invitation|
      next if responded_emails.include?(invitation.email_address)

      user = User.find_by(email_address: invitation.email_address)

      participants << {
        id: user ? "user_#{user.id}" : "invite_#{invitation.id}",
        name: user ? user.name : invitation.email_address,
        responded: false,
        slot_ids: []
      }
    end
    participants
  end

  def valid_create_params?
    authenticated? || params[:participant_name]
  end

  def sanitized_time_slot_ids
    (params[:time_slot_ids] || []).compact_blank
  end

  def create_availabilities(event, time_slot_ids)
    if authenticated?
      create_authenticated_user_availabilities(event, time_slot_ids)
    else
      create_anonymous_user_availabilities(event, time_slot_ids, params[:participant_name])
    end
  end

  def create_authenticated_user_availabilities(event, time_slot_ids)
    Current.user.availabilities.joins(:time_slot).where(time_slots: { event_id: event.id }).destroy_all
    create_availabilities_for_event(event, time_slot_ids)
  end

  def create_anonymous_user_availabilities(event, time_slot_ids, participant_name)
    anonymous_session_id = cookies.signed[:anonymous_session_id] || SecureRandom.hex(16)
    store_anonymous_session_cookie(anonymous_session_id) if cookies.signed[:anonymous_session_id].blank?
    Availability.joins(:time_slot)
                .where(time_slots: { event_id: event.id })
                .where(anonymous_session_id:).destroy_all
    create_availabilities_for_event(event, time_slot_ids, anonymous_session_id, participant_name)
  end

  def create_availabilities_for_event(event, time_slot_ids, anonymous_session_id = nil, participant_name = nil)
    time_slot_ids.each do |slot_id|
      time_slot = event.time_slots.find(slot_id)
      availability_params = { time_slot: }
      if anonymous_session_id
        availability_params.merge!(anonymous_session_id:, participant_name:)
      else
        availability_params.merge!(user: Current.user)
      end
      Availability.create!(availability_params)
    end
  end

  def render_validation_error
    handle_no_participant_name
  end

  def handle_no_participant_name
    render json: { errors: { participant_name: ['is required'] } }, status: :unprocessable_entity
  end
end
