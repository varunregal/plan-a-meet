class EventsController < ApplicationController
  # Before creating an event, I need to create timeslots and associate it with the event
  def new
    event = Event.new
    render inertia: "Event/New", props: { event: }
  end

  private
  def event_params
    params.expect(event: [ :name, :url ])
  end
end
