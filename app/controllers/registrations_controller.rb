class RegistrationsController < ApplicationController
  allow_unauthenticated_access only: %i[new create]
  before_action :redirect_if_authenticated, only: [:new]
  rate_limit to: 10, within: 3.minutes, only: :create, with: lambda {
    redirect_to new_registration_url, alert: 'Too many registration attempts. Please try again later'
  }

  def new
    render inertia: 'Auth/Signup'
  end

  def create # rubocop:disable Metrics/AbcSize
    @user = User.new(user_params)
    if @user.save
      start_new_session_for @user
      UserMailer.welcome_email(@user).deliver_later
      assign_pending_event_creator(@user)
      check_if_user_created_in_event_path
      if @pending_event
        redirect_to event_path(@pending_event), notice: t('.pending_event_success')
      elsif @current_event
        redirect_to event_path(@current_event), notice: t('.success')
      else
        redirect_to root_path, notice: t('.success')
      end
    else
      redirect_to new_registration_path, inertia: {
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
