FactoryBot.define do
  factory :invitation do
    association :event, :with_creator
    association :inviter, factory: :user
    email_address { Faker::Internet.email }
    status { 'pending' }
  end
end
