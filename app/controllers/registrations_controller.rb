class RegistrationsController < ApplicationController
  allow_unauthenticated_access only: %i[new create]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_registration_url, alert: "Try again later." }

  def new
    render inertia: "Auth/Signup"
  end
  def create
    begin
      user = User.new(user_params)
      user.save!
      start_new_session_for user
      flash[:notice] = t(".success")
      redirect_to root_path
    rescue ActiveRecord::RecordInvalid => e
      handle_record_invalid(e, new_registration_path)
    end
  end

  private
  def user_params
    params.permit(:name, :email_address, :password)
  end
end
