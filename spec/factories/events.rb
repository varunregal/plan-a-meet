FactoryBot.define do
  factory :event do
    name { 'Bar Hopping' }
    url { SecureRandom.hex(6) }
    status { 'created' }

    trait :with_creator do
      event_creator { association :user }
    end
  end
end
