class AvailabilitiesController < ApplicationController
  allow_unauthenticated_access only: %i[index create]
  def index
    event = Event.find_by!(url: params[:event_url])
    availabilities = Availability.joins(:time_slot)
                                 .where(time_slots: { event_id: event.id })
                                 .includes(:user, :time_slot)
    availability_data = availabilities.each_with_object({}) do |availability, hash|
      slot = availability.time_slot
      date_key = slot.start_time.strftime('%a %b %d %Y')
      hour = slot.start_time.hour
      minute = slot.start_time.min
      key = "#{date_key}-#{hour}-#{minute}"
      name = availability.user ? availability.user.name : availability.participant_name
      hash[key] ||= []
      hash[key] << name
    end
    current_user_slots = if authenticated?
                           Current.user.availabilities
                                  .joins(:time_slot)
                                  .where(time_slots: { event_id: event.id })
                                  .pluck(:time_slot_id)
                         elsif cookies.signed[:anonymous_session_id].present?
                           Availability.joins(:time_slot)
                                       .where(time_slots: { event_id: event.id })
                                       .where(anonymous_session_id: cookies.signed[:anonymous_session_id])
                                       .pluck(:time_slot_id)
                         else
                           []
                         end

    render json: {
      availability_data: availability_data,
      current_user_slots: current_user_slots
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
