class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[ new create ]
  before_action :redirect_if_authenticated, only: [ :new ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_url, inertia: { errors: { base: [ "Too many attempts. Please try again later." ] } } }

  def new
    render inertia: "Auth/Login"
  end


  def create
    if user = User.authenticate_by(params.permit(:email_address, :password))
      start_new_session_for user
      assign_pending_event_creator(user)
      check_if_user_created_in_event_path
      if @pending_event
        flash[:notice] = t(".pending_event_success")
        redirect_to event_path(@pending_event)
      elsif @current_event
        flash[:notice] = t(".success")
        redirect_to event_path(@current_event)
      else
        flash[:notice] = t(".success")
        redirect_to after_authentication_url
      end
    else
      redirect_to new_session_path, inertia: { errors: { base: [ t(".error") ] } }
    end
  end

  def destroy
    terminate_session
    flash[:notice] = t(".success")
    redirect_to root_path
  end
end
