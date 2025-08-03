class RegistrationsController < ApplicationController
  allow_unauthenticated_access only: %i[create]
  # before_action :redirect_if_authenticated, only: [:new]
  rate_limit to: 10, within: 3.minutes, only: :create, with: lambda {
    redirect_back(
      fallback_location: root_path,
      inertia: { errors: { base: 'Too many attempts. Please try again later.' } }
    )
  }

  # def new
  #   render inertia: 'Auth/Signup'
  # end

  def create
    @user = User.new(user_params)
    if @user.save
      start_new_session_for @user
      UserMailer.welcome_email(@user).deliver_later
      convert_anonymous_to_authenticated(@user)
      redirect_back fallback_location: root_path, notice: t('.success')
    else
      redirect_back fallback_location: root_path, inertia: {
        errors: inertia_errors(@user)
      }
    end
  rescue ActiveRecord::RecordNotFound
    redirect_to root_path, alert: 'The event no longer exists, but your account was created successfully'
  end

  private

  def user_params
    params.permit(:name, :email_address, :password)
  end
end
