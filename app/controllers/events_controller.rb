require "pry"
class EventsController < ApplicationController
  allow_unauthenticated_access only: [ :new, :create, :show ]
  def show
    event = Event.find_by(url: params[:url])
    render inertia: "Event/Show", props: { event: EventSerializer.new(event) }
  end

  def new
    render inertia: "Event/New"
  end
  def create
    response = Events::Create.new(create_event_params).create_time_slots_and_event
    if response.success?
      redirect_to event_path(response.data)
    else
      handle_error(response.error, new_event_path)
    end
  end



  private
  def create_event_params
    params.expect(event: [ :name, :start_time, :end_time, :time_zone, dates: [] ])
  end
end
