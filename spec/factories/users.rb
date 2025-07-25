FactoryBot.define do
  factory :user do
    name { 'Varun' }
    email_address { Faker::Internet.unique.email }
    password { 'password' }

    trait :john do
      name { 'John' }
      email_address { 'john@example.com' }
    end
  end
end
