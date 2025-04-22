require "pry"
class EventsController < ApplicationController
  def show
    event = Event.find_by(url: params[:url])
    render inertia: "Event/Show", props: {
      name: event.name,
      url: event.url,
      timeSlots: event.time_slots,
      numberOfEventUsers: event.users.uniq.count
    }
  end

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
    params.expect(event: [ :name, :start_date, :end_date, :start_time, :end_time, :time_zone ])
  end
end
