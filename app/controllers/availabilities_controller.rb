require "pry"
class AvailabilitiesController < ApplicationController
  before_action :require_authentication
  before_action :set_time_slot!, only: [ :create, :destroy ]

  def index
    event = Event.find_by(url: params[:event_url])
    time_slots = event.time_slots
    availabilities = Availability.where(time_slot: time_slots).includes(:user, :time_slot)
    current_user_availabilities = Availability.where(user: Current.user).includes(:user)
    users = event.users.distinct
    render json: {
      success: true,
      data: {
        availabilities: ActiveModelSerializers::SerializableResource.new(availabilities, each_serializer: AvailabilitySerializer, include: [ "user" ]),
        current_user_availabilities: ActiveModelSerializers::SerializableResource.new(current_user_availabilities, each_serializer: AvailabilitySerializer, include: [ "user" ]), participants: ActiveModelSerializers::SerializableResource.new(users, each_serializer: UserSerializer)
      }
    }
  end

  def create
    availability = Current.user.availabilities.build(time_slot: @time_slot)
    if availability.save!
      render json: { success: true, data: { availability: AvailabilitySerializer.new(availability) } }, status: :created
    end
  rescue ActiveRecord::RecordNotFound => exception
    render json: { success: false, errors: exception.message }, status: :not_found
  rescue ActiveRecord::RecordInvalid => exception
    render json: { success: false, errors: exception.message }, status: :unprocessable_entity
  end

  def destroy
    availability = Current.user.availabilities.find_by(time_slot: @time_slot)
    if availability.destroy!
      render json: { success: true, data: { availability: AvailabilitySerializer.new(availability) } }, status: :ok
    end
  rescue ActiveRecord::RecordNotFound => exception
    render json: { success: false, errors: exception.message }, status: :not_found
  end

  private
  def set_time_slot!
    @time_slot = TimeSlot.find(params[:time_slot_id])
  rescue ActiveRecord::RecordNotFound => exception
    render json: { success: false, errors: exception.message }, status: :unprocessable_entity
  end
end
