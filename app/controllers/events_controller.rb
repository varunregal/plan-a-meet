class EventsController < ApplicationController
  def show
    event = Event.find_by(url: params[:url])
    puts event
    render inertia: "Event/Show", props: {
      name: event.name
    }
  end
  # Before creating an event, I need to create timeslots and associate it with the event
  def new
    render inertia: "Event/New"
  end
  def create
    response = Events::Create.new(create_event_params).create_time_slots_and_event
    if response.success?
      render json: response.data
    else
      handle_error(response.error)
    end
  end



  private
  def create_event_params
    params.expect(event: [ :name, :start_date, :end_date, :start_time, :end_time ])
  end
end
