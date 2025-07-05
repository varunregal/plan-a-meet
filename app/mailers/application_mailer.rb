class ApplicationMailer < ActionMailer::Base
  default from: 'noreply@resend.dev'
  layout 'mailer'
end
