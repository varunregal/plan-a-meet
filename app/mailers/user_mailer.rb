class UserMailer < ApplicationMailer
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.welcome_email.subject
  #
  def welcome_email(user)
    @user = user
    @app_name = 'Plan A Meet'
    mail(to: @user.email_address, subject: "Welcome to #{@app_name}")
  end
end
