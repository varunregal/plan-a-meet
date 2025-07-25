class EventsController < ApplicationController
  allow_unauthenticated_access only: %i[new]
  def new
    render inertia: 'Event/New'
  end

  def create
    event = Event.new(event_params)

    if event.save
      redirect_to event_path(event.url)
    else
      redirect_to new_event_path, inertia: { errors: event.errors }
    end
  end
end
