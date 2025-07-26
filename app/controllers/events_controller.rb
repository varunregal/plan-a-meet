require 'pry'
class EventsController < ApplicationController
  allow_unauthenticated_access only: %i[new create]
  def new
    render inertia: 'Event/New'
  end

  def create
    ActiveRecord::Base.transaction do
      event = Event.new(event_params)
      event.event_creator = Current.user if authenticated?

      if event.save
        create_time_slots(event)
        redirect_to event_path(event.url)
      else
        redirect_to new_event_path, inertia: { errors: event.errors }
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    redirect_to new_event_path, alert: 'Please check your event details and try again.'
  rescue StandardError => e
    Rails.logger.error "Event creation failed: #{e.class} - #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    redirect_to new_event_path,
                alert: "We couldn't create your event. Please try again or contact support if the problem persists."
  end

  private

  def event_params
    params.permit(:name)
  end

  def create_time_slots(event)
    event.create_time_slots(
      dates: params[:dates],
      start_time: params[:start_time],
      end_time: params[:end_time],
      time_zone: params[:time_zone]
    )
  end
end
