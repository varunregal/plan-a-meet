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
end
