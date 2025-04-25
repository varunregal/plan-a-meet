class RegistrationsController < ApplicationController
  allow_unauthenticated_access only: %i[new create]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_registration_url, alert: "Try again later." }

  def new
    render inertia: "Auth/Signup"
  end
  def create
    user = User.new(user_params)
    if user.save
      start_new_session_for user
      flash[:notice] = "Signed up successfully!"
      redirect_to root_path
    else
      redirect_to new_registration_path, inertia: { errors: { message: user.errors.full_messages.join("\n") } }
    end
  end

  private
  def user_params
    params.permit(:name, :email_address, :password)
  end
end
