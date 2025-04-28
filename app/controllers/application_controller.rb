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
end
