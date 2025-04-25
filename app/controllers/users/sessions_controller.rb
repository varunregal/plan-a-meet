# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  def new
    render inertia: "Auth/Login"
  end

  # POST /resource/sign_in
  # def create
  #   super do |resource|
  #     if request.inertia?
  #       flash.discard
  #       return inertia_location after_sign_in_path_for(resource)
  #     end
  #   end
  # end
  def create
    user = warden.authenticate(auth_options)

    if user
      sign_in(resource_name, user)

      # SPA-style redirect with Inertia
      if request.inertia?
        flash.discard
        inertia_location after_sign_in_path_for(user)
      else
        redirect_to after_sign_in_path_for(user)
      end
    else
      # Re-render login page with Inertia-friendly validation error
      render inertia: "Auth/Login", props: {
        errors: { email: [ "Invalid email or password" ] }
      }, status: :unprocessable_entity
    end
  end
  # DELETE /resource/sign_out
  def destroy
    signed_out_path = after_sign_out_path_for(resource_name)
    signed_out = Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
    set_flash_message! :notice, :signed_out if signed_out

    if request.inertia?

      response.headers["X-Inertia-Location"] = signed_out_path
      render json: {}, status: :conflict

    else
      # Fallback for non-Inertia requests remains the same
      redirect_to signed_out_path, status: :see_other
    end
  end

  # protected
  def after_sign_out_path_for(resource)
    new_user_session_path
  end
  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
