require 'pry'
class EventsController < ApplicationController
  allow_unauthenticated_access only: %i[new create]
  def new
    render inertia: 'Event/New'
  end

  def create
    event = build_event
    ActiveRecord::Base.transaction do
      event.save!
      create_time_slots(event)
    end
    redirect_to event_path(event), notice: 'Event created successfully!'
  rescue ActiveRecord::RecordInvalid
    redirect_to new_event_path, inertia: { errors: event.errors }
  rescue ArgumentError => e
    event.errors.add(:base, e.message)
    redirect_to new_event_path, inertia: { errors: event.errors }
  rescue StandardError => e
    log_error(e)
    redirect_to new_event_path,
                alert: "We couldn't create your event. Please try again or contact support if the problem persists."
  end

  private

  def event_params
    params.permit(:name)
  end

  def build_event
    Event.new(event_params).tap do |event|
      event.event_creator = Current.user if authenticated?
    end
  end

  def create_time_slots(event)
    event.create_time_slots(
      dates: params[:dates],
      start_time: params[:start_time],
      end_time: params[:end_time],
      time_zone: params[:time_zone]
    )
  end

  def log_error(error)
    Rails.logger.error "Event creation failed: #{error.class} - #{error.message}"
    Rails.logger.error error.backtrace.join("\n")
  end
end
