class PasswordsController < ApplicationController
  allow_unauthenticated_access
  before_action :set_user_by_token, only: %i[edit update]

  def new; end

  def edit; end

  def create
    email_address = params[:email_address]&.downcase&.strip
    if email_address.blank? || !email_address.match?(URI::MailTo::EMAIL_REGEXP)
      redirect_to new_password_path, alert: 'Please enter a valid email address'
      return
    end
    user = User.find_by(email_address:)
    PasswordsMailer.reset(user).deliver_later
    redirect_to new_session_path,
                notice: "If an account exists with #{email_address}, we've sent password reset instructions"
  end

  def update
    if @user.update(params.permit(:password, :password_confirmation))
      redirect_to new_session_path, notice: 'Password has been reset.'
    else
      redirect_to edit_password_path(params[:token]), alert: @user.errors.full_messages.to_sentence
    end
  end

  private

  def set_user_by_token
    @user = User.find_by_password_reset_token!(params[:token])
  rescue ActiveSupport::MessageVerifier::InvalidSignature
    redirect_to new_password_path, alert: 'Password reset link is invalid or has expired.'
  end
end
