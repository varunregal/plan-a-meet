class ScheduledSlotsController < ApplicationController
  def index
    event = Event.find_by(url: params[:event_url])
    render inertia: "ScheduledSlot/Index", props: { event: EventSerializer.new(event) }
  end
  def create
    event = Event.find_by!(url: params[:event_url])
    time_slot = TimeSlot.find(params[:time_slot_id])
    scheduled_slot = event.scheduled_slots.build(time_slot:)
    if scheduled_slot.save!
      render json: { success: true, data: { time_slot_id: scheduled_slot.time_slot_id } }, status: :created
    end
  rescue ActiveRecord::RecordNotFound => exception
    render json: { success: false, errors: "Couldn't find the current #{exception.model}" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => exception
    render json: { success: false, errors: exception.message }, status: :unprocessable_entity
  end
end
