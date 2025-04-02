module ApiErrorHandler
  extend ActiveSupport::Concern

  def handle_error(error)
    case error
    when ActiveRecord::RecordNotFound
      render_error("Resource not found", :not_found)
    when ActiveRecord::RecordInvalid
      render_error("Validation failed", :unprocessable_entity, error.record.errors.full_messages)
    when ArgumentError
      render_error(error.message, :bad_request)
    else
      Rails.logger.error("Unexpected error: #{error.class} - #{error.message}")
      render_error("An unexpected error occurred", :internal_server_error)
    end
  end

  def render_error(message, status, details = nil)
    response = { message: message }
    response[:details] = details if details
    render json: response, status: status
  end
end
