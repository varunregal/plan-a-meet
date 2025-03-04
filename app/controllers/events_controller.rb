class EventsController < ApplicationController
  # Before creating an event, I need to create timeslots and associate it with the event
  def new
    render inertia: "Event/New"
  end
  def create
    render json: { message: "Success" }, status: :ok
  end


  private
  def event_params
    params.expect(event: [ :name, time_slots_attributes: [ :start_time, :end_time ] ])
  end
end
