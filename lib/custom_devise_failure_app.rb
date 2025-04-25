class CustomDeviseFailureApp < Devise::FailureApp
  def respond
    if request.inertia? || request.format.json?
      self.status = :unprocessable_entity
      self.content_type = "application/json"
      validation_errors = resource&.errors&.present? ? resource.errors.messages : nil

      # Use specific validation errors if available, otherwise fallback to generic message.
      error_payload = validation_errors || { message: [ i18n_message ] } # Use array for consistency

      self.response_body= {
        component: component_to_render_on_failure,
        props: {
          errors: error_payload,
          flash: { alert: i18n_message },
          url: request.original_fullpath
        }.to_json
      }
    else
      super
    end
  end

  private
  def component_to_render_on_failure
    if request.path.starts_with?(warden_options[:attempted_path]) && warden_options[:action] == "create" && warden_options[:scope] == :user && request.path.include?("/sign_up")
      "Auth/Register"
    else
      "Auth/Login"
    end
  end

  def redirect_url
    return nil if request.inertia? || request.format.json?
    super
  end

  def resource
    warden.user(warden_options[:scope]) || warden_options[:resource]
  end
end
