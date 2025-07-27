require 'pry'
class ApplicationController < ActionController::Base
  include Authentication
  include ApiErrorHandler
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  inertia_share flash: -> { flash.to_hash }, current_user: -> { Current.user.as_json if Current.user }
  allow_browser versions: :modern

  private

  def inertia_errors(model, full_messages: true)
    model.errors.to_hash(full_messages).transform_values(&:to_sentence)
  end

  def assign_pending_event_creator(user)
    return unless session[:pending_event_url]

    event = Event.find_by!(url: session.delete(:pending_event_url))
    return unless event

    event.update(event_creator: user)
    @pending_event = event
  end

  def check_if_user_created_in_event_path
    return unless session[:user_created_in_event_path]

    event = Event.find_by!(url: session.delete(:user_created_in_event_path))
    return unless event

    @current_event = event
  end
end
