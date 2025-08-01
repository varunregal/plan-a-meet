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

  def convert_anonymous_to_authenticated(user)
    return if cookies.signed[:anonymous_session_id].blank?

    anonymous_session_id = cookies.signed[:anonymous_session_id]
    # rubocop:disable Rails/SkipsModelValidations
    Event.where(anonymous_session_id:).update_all(event_creator_id: user.id, anonymous_session_id: nil)
    Availability.where(anonymous_session_id:).update_all(user_id: user.id, anonymous_session_id: nil)
    cookies.delete(:anonymous_session_id)
  end

  def store_anonymous_session_cookie(value)
    cookies.signed[:anonymous_session_id] ||= {
      value:,
      expires: 30.days.from_now,
      httponly: true,
      same_site: :lax
    }
  end
end
