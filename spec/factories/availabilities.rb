FactoryBot.define do
  factory :availability do
    association :user
    association :time_slot
  end
end
