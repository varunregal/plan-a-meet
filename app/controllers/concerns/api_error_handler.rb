module ApiErrorHandler
  extend ActiveSupport::Concern

  def handle_error(exception, path)
    case exception
    when ActiveRecord::RecordNotFound
      handle_record_not_found(exception, path)
    when ActiveRecord::RecordInvalid
      handle_record_invalid(exception, path)
    when ArgumentError
      handle_argument_error(exception, path)
    else
      handle_unexpected_error(exception, path)
    end
  end

  private

  def handle_record_invalid(exception, path)
    redirect_to path, inertia: { errors: exception.record.errors.messages }
  end

  def handle_argument_error(exception, path)
    redirect_to path, inertia: { errors: exception.message }
  end

  def handle_unexpected_error(exception, path)
    redirect_to path, inertia: { errors: "Unexpected error: #{error.class} - #{error.message}" }
  end

  def handle_record_not_found(exception, path)
    redirect_to path, inertia: { errors: "#{exception.class} not found" }
  end
end
