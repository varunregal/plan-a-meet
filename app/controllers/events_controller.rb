require 'pry'
class EventsController < ApplicationController
  allow_unauthenticated_access only: %i[new create]
  def new
    render inertia: 'Event/New'
  end

  def create
    event = Event.new(event_params)

    if event.save
      create_time_slots(event)
      redirect_to event_path(event.url)
    else
      redirect_to new_event_path, inertia: { errors: event.errors }
    end
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
