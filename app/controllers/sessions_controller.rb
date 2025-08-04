class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[create]
  # before_action :redirect_if_authenticated, only: [:new]
  rate_limit to: 10, within: 3.minutes, only: :create, with: lambda {
    redirect_back(
      fallback_location: root_path,
      inertia: { errors: { base: 'Too many attempts. Please try again later.' } }
    )
  }

  def create
    user = User.authenticate_by(params.permit(:email_address, :password))
    if user
      start_new_session_for user
      convert_anonymous_to_authenticated(user)
      redirect_back fallback_location: root_path, notice: "Welcome back, #{user.name}"
    else
      redirect_back(
        fallback_location: root_path,
        inertia: { errors: { base: 'Invalid email or password' } }
      )
    end
  end

  def destroy
    terminate_session
    redirect_to root_path, notice: t('.success')
  end
end
