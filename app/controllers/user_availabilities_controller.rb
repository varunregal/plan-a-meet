class UserAvailabilitiesController < ApplicationController
  before_action :find_event
  def index
    availabilities = UserAvailability.where(event: @event)
    render json: availabilities
  end
  def create
    response = UserAvailabilities::Create.new(@event, user_availabilities_params).perform
    if response.success?
      render json: response.data
    else
      handle_error(response.error)
    end
  end


  private
  def find_event
    @event = Event.find_by(url: params[:event_url])
  end
  def user_availabilities_params
    params.expect(user_availabilities: [ :user_id, :time_slot ])
  end
end
