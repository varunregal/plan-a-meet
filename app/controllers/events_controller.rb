require "pry"
class EventsController < ApplicationController
  allow_unauthenticated_access only: [ :new, :create, :show ]
  before_action :set_event, only: [ :edit, :update ]
  def show
    event = Event.find_by(url: params[:url])
    if !Current.user
      session[:user_created_in_event_path] = event.url
    end
    render inertia: "Event/Show", props: { event: EventSerializer.new(event) }
  end

  def new
    render inertia: "Event/New"
  end

  def edit
    # TODO
  end

  def create
    response = Events::Create.new(create_event_params, current_user: Current.user).create_time_slots_and_event
    if response.success?
      event = response.data
      if Current.user
        flash[:notice] = t(".success")
        redirect_to event_path(event)
      else
        session[:pending_event_url] = event.url
        flash[:alert] = t(".error")
        redirect_to event_path(event)
      end
    else
      handle_error(response.error, new_event_path)
    end
  end
  def update
    # TODO
  end



  private
  def create_event_params
    params.expect(event: [ :name, :start_time, :end_time, :time_zone, dates: [] ])
  end

  def set_event
    @event = Event.find_by(url: params[:url])
  end
end
