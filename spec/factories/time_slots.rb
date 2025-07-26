FactoryBot.define do
  factory :time_slot do
    start_time { '2025-08-02 02:00:00' }
    end_time { '2025-08-02 02:15:00' }
    association :event
  end
end
