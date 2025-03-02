FactoryBot.define do
  factory :time_slot do
    start_time { "2025-03-02 02:31:57" }
    end_time { "2025-03-02 02:31:57" }
    association :event
  end
end
