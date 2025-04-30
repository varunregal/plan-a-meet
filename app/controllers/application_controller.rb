require "pry"
class ApplicationController < ActionController::Base
  include Authentication
  include ApiErrorHandler
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  inertia_share flash: -> {
    {
      success: flash[:notice],
      error: flash[:alert]
    }
  }, current_user: -> { UserSerializer.new(Current.user) if Current.user }
  allow_browser versions: :modern

  private
  def assign_pending_event_creator(user)
    return unless session[:pending_event_url]
    event = Event.find_by!(url: session.delete(:pending_event_url))
    nil unless event

    event.update!(event_creator: user)
    @pending_event = event
  end

  def check_if_user_created_in_event_path
    return unless session[:user_created_in_event_path]
    event = Event.find_by!(url: session.delete(:user_created_in_event_path))
    nil unless event
    @current_event = event
  end
end
