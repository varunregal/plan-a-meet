require "pry"
class AvailabilitiesController < ApplicationController
  before_action :require_authentication
  before_action :set_time_slot!, only: [ :create ]

  def index
    event = Event.find_by(url: params[:event_url])
    time_slots = event.time_slots
    availabilities = Availability.where(time_slot: time_slots).includes(:user, :time_slot)
    current_user_availabilities = Availability.where(user: Current.user)
    render json: { availabilities:, current_user_availabilities: }
  end

  def create
    availability = Current.user.availabilities.build(time_slot: @time_slot)
    if availability.save!
      render json: { success: true, time_slot_id: @time_slot.id }
    end
  rescue ActiveRecord::RecordNotFound => exception
    render json: { success: false, errors: exception.message }
  rescue ActiveRecord::RecordInvalid => exception
    render json: { success: false, errors: exception.message }
  end

  private
  def set_time_slot!
    @time_slot = TimeSlot.find(params[:time_slot_id])
  rescue ActiveRecord::RecordNotFound => exception
    render json: { success: false, errors: exception.message }
  end
end
