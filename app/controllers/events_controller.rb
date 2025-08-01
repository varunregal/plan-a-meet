class EventsController < ApplicationController
  allow_unauthenticated_access only: %i[new create show]

  def show
    event = Event.includes(:invitations, :time_slots, :event_creator).find_by!(url: params[:url])
    is_creator = check_if_creator(event)
    render inertia: 'Event/Show', props: event_show_props(event, is_creator)
  end

  def new
    render inertia: 'Event/New'
  end

  def create
    anonymous_session_id = ensure_anonymous_session_value
    event = build_event_with_session(anonymous_session_id)
    ActiveRecord::Base.transaction do
      event.save!
      create_time_slots(event)
    end
    store_anonymous_session_cookie(anonymous_session_id) if anonymous_session_id
    redirect_to event_path(event), notice: 'Event created successfully!'
  rescue ActiveRecord::RecordInvalid
    redirect_to new_event_path, inertia: { errors: event.errors }
  rescue ArgumentError => e
    handle_argument_error(event, e)
  rescue StandardError => e
    handle_standard_error(e)
  end

  private

  def event_params
    params.permit(:name, :time_zone)
  end

  def time_slot_params
    params.permit(:start_time, :end_time, :time_zone, dates: [])
  end

  def check_if_creator(event)
    return event.event_creator_id == Current.user&.id if authenticated?

    event.anonymous_session_id == cookies.signed[:anonymous_session_id] if event.anonymous_session_id.present?
  end

  def event_show_props(event, is_creator)
    {
      event: event.as_json(only: %i[id name url]),
      is_creator:,
      event_creator: event.event_creator&.name,
      invitations: event.invitations.as_json(only: %i[id email_address status created_at]),
      time_slots: event.time_slots.as_json(only: %i[id start_time end_time])
    }
  end

  def build_event
    Event.new(event_params).tap do |event|
      if authenticated?
        event.event_creator = Current.user
      else
        event.anonymous_session_id = cookies.signed[:anonymous_session_id]
      end
    end
  end

  def create_time_slots(event)
    event.create_time_slots(
      dates: time_slot_params[:dates],
      start_time: time_slot_params[:start_time],
      end_time: time_slot_params[:end_time],
      time_zone: time_slot_params[:time_zone]
    )
  end

  def log_error(error)
    Rails.logger.error "Event creation failed: #{error.class} - #{error.message}"
    Rails.logger.error error.backtrace.join("\n")
  end

  def handle_argument_error(event, error)
    event.errors.add(:base, error.message)
    redirect_to new_event_path, inertia: { errors: event.errors }
  end

  def handle_standard_error(error)
    log_error(error)
    redirect_to new_event_path,
                alert: "We couldn't create your event. Please try again or contact support if the problem persists."
  end

  def ensure_anonymous_session_value
    return nil if authenticated?

    cookies.signed[:anonymous_session_id] || SecureRandom.hex(16)
  end

  def build_event_with_session(anonymous_session_id)
    Event.new(event_params).tap do |event|
      if authenticated?
        event.event_creator = Current.user
      else
        event.anonymous_session_id = anonymous_session_id
      end
    end
  end
end
