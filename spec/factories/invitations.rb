FactoryBot.define do
  factory :invitation do
    event { nil }
    inviter { nil }
    invitee { nil }
    email_address { "MyString" }
    status { "MyString" }
    invitation_token { "MyString" }
    sent_at { "2025-07-05 02:20:37" }
  end
end
