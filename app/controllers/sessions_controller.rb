class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[new create]
  before_action :redirect_if_authenticated, only: [:new]
  rate_limit to: 10, within: 3.minutes, only: :create, with: lambda {
    redirect_to new_session_url, alert: 'Too many attempts. Please try again later.'
  }

  def new
    render inertia: 'Auth/Login'
  end

  def create
    user = User.authenticate_by(params.permit(:email_address, :password))
    if user
      start_new_session_for user

      redirect_to after_authentication_url, notice: t('.success')
    else
      redirect_to new_session_path, inertia: { errors: { base: [t('.error')] } }
    end
  end

  def destroy
    terminate_session
    redirect_to root_path, notice: t('.success')
  end
end
