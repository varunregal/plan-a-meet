FactoryBot.define do
  factory :event do
    name { "Bar Hopping" }
    start_time { "7" }
    end_time { "9" }
    time_zone { "America/New_York" }
    dates { [ "2025-04-19T04:00:00.000Z", "2025-04-20T04:00:00.000Z", "2025-04-21T04:00:00.000Z" ] }
  end
end
