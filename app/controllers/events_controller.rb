require 'pry'
class EventsController < ApplicationController
  allow_unauthenticated_access only: %i[new create show]
  def show
    event = Event.find_by(url: params[:url])
    session[:user_created_in_event_path] = event.url unless Current.user
    render inertia: 'Event/Show', props: { event: EventSerializer.new(event) }
  end

  def new
    render inertia: 'Event/New'
  end

  def edit
    # TODO
  end

  def create
    response = Events::Create.new(create_event_params, current_user: Current.user).create_time_slots_and_event
    if response.success?
      event = response.data
      if Current.user
        flash[:notice] = t('.success')
      else
        session[:pending_event_url] = event.url
        flash[:alert] = t('.error')
      end
      redirect_to event_path(event)
    else
      handle_error(response.error, new_event_path)
    end
  end

  def update
  end

  def schedule
    event = Event.find_by(url: params[:url])
    if request.get?
      render inertia: 'Event/Schedule',
             props: { event: EventSerializer.new(event), scheduled_slots: event.scheduled_time_slots }
    else
      event.transaction do
        event.scheduled_slots.delete_all
        params[:slot_ids].each do |sid|
          event.scheduled_slots.create!(time_slot_id: sid)
        end
        event.update!(status: 'scheduled')
      end
      render json: { success: true, data: { event: } }
    end
  rescue ActiveRecord::RecordNotFound => e
    render json: { success: false, errors: "Couldn't find the current #{e.model}" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { success: false, errors: e.message }, status: :unprocessable_entity
  rescue StandardError => e
    render json: { success: false, errors: e.message }, status: :internal_server_error
  end

  def confirmation
    event = Event.find_by(url: params[:url])
    render inertia: 'Event/Confirmation', props: { event: EventSerializer.new(event) }
  end

  private

  def create_event_params
    params.expect(event: [:name, :start_time, :end_time, :time_zone, { dates: [] }])
  end
end
