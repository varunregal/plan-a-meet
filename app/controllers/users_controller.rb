class UsersController < ApplicationController
  def create
    response = Users::Create.new(params).perform
    if response.success?
      render json: response.data
    else
      handle_error(response.error)
    end
  end

  private
  def user_params
    params.expect(user: [ :name, :password, :event ])
  end
end
