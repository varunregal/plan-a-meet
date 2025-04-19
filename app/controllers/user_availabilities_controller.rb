class UserAvailabilitiesController < ApplicationController
  def create
    response = UserAvailabilities::Create.new(user_availabilities_params).perform
    if response.success?
      render json: response.data
    else
      handle_error(response.error)
    end
  end

  private
  def user_availabilities_params
    params.expect(user_availabilities: [ :url, :user_id, time_slots: [] ])
  end
end
