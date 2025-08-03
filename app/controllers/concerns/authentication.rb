module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :load_current_session
    before_action :require_authentication
    helper_method :authenticated?
  end

  class_methods do
    def allow_unauthenticated_access(**options)
      skip_before_action :require_authentication, **options
    end
  end

  private

  # When user is authenticated and if the page doesn't require authentication
  def load_current_session
    Current.session ||= find_session_by_cookie
  end

  def authenticated?
    resume_session
  end

  def redirect_if_authenticated
    return unless resume_session

    redirect_to profile_path, inertia: { errors: { base: t('common.already_authenticated') } }
  end

  # Calls request authentication only if the authenticated? check fails
  def require_authentication
    resume_session || request_authentication unless authenticated?
  end

  def resume_session
    Current.session ||= find_session_by_cookie
  end

  def find_session_by_cookie
    Session.find_by(id: cookies.signed[:session_id]) if cookies.signed[:session_id]
  end

  def request_authentication
    session[:return_to_after_authenticating] = request.url
    redirect_back(fallback_location: root_path)
  end

  def after_authentication_url
    session.delete(:return_to_after_authenticating) || root_url
  end

  def start_new_session_for(user)
    user.sessions.create!(user_agent: request.user_agent, ip_address: request.remote_ip).tap do |session|
      Current.session = session
      cookies.signed.permanent[:session_id] = { value: session.id, httponly: true, same_site: :lax }
    end
  end

  def terminate_session
    Current.session.destroy
    cookies.delete(:session_id)
  end
end
