class UserAvailabilitiesController < ApplicationController
  before_action :find_event
  def index
    availabilities = UserAvailability.includes(:user, :event, :time_slot).where(event: @event)
    users = @event.users.distinct
    render json: { availabilities: ActiveModelSerializers::SerializableResource.new(availabilities), users: ActiveModelSerializers::SerializableResource.new(users) }
  end
  def create
    response = UserAvailabilities::Create.new(@event, user_availabilities_params).perform
    if response.success?
      render json: response.data
    else
      handle_error(response.error)
    end
  end

  def destroy
    availability = UserAvailability.find(params[:id])
    availability.destroy!
    render json: availability
  rescue => e
    handle_error(e)
  end


  private
  def find_event
    @event = Event.find_by(url: params[:event_url])
  end
  def user_availabilities_params
    params.expect(user_availabilities: [ :user_id, :time_slot ])
  end
end
