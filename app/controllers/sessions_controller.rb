class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[new create]
  before_action :redirect_if_authenticated, only: [:new]
  rate_limit to: 10, within: 3.minutes, only: :create, with: lambda {
    redirect_to new_session_url, alert: 'Too many attempts. Please try again later.'
  }

  def new
    render inertia: 'Auth/Login'
  end

  def create # rubocop:disable Metrics/AbcSize
    user = User.authenticate_by(params.permit(:email_address, :password))
    if user
      start_new_session_for user
      assign_pending_event_creator(user)
      check_if_user_created_in_event_path
      if @pending_event
        redirect_to event_path(@pending_event), notice: t('.pending_event_success')
      elsif @current_event
        redirect_to event_path(@current_event), notice: t('.success')
      else
        redirect_to after_authentication_url, notice: t('.success')
      end
    else
      redirect_to new_session_path, inertia: { errors: { base: [t('.error')] } }
    end
  end

  def destroy
    terminate_session
    redirect_to root_path, notice: t('.success')
  end
end
