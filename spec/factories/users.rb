FactoryBot.define do
  factory :user do
    name { "MyString" }
    password_digest { "MyString" }
    event { nil }
  end
end
