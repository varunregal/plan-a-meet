class EventsController < ApplicationController
  # Before creating an event, I need to create timeslots and associate it with the event
  def new
    render inertia: "Event/New"
  end
  def create
    response = Event::Create.new(create_event_params).create_time_slots_and_event

    render json: response
  end


  private
  def create_event_params
    params.expect(event: [ :name, :start_date, :end_date, :start_time, :end_time ])
  end
end
