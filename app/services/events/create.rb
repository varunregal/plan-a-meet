require "time"
require "pry"
class Events::Create
  def initialize(params)
    @name = params.fetch(:name)
    @start_date = params.fetch(:start_date)
    @end_date = params.fetch(:end_date)
    @start_time = params.fetch(:start_time)
    @end_time = params.fetch(:end_time)
  end

  def create_time_slots_and_event
    ActiveRecord::Base.transaction do
      event = Event.new(name: @name, url: SecureRandom.base64(8).gsub("/", "_").gsub(/=+$/, ""))
      create_time_slots(event)
      event.save!
      Result.success(event)
    end
  rescue => e
    Result.failure(e)
  end

  def create_time_slots(event)
    time_slots = generate_time_slots
    time_slots.each do |slot|
      event.time_slots.build(start_time: slot[:start_date_time], end_time: slot[:end_date_time])
    end
  end

  def generate_time_slots
    start_date_time = parse_and_combine_date_time(@start_date, @start_time)
    end_date_time = parse_and_combine_date_time(@end_date, @end_time)
    if start_date_time > end_date_time
      raise ArgumentError, "Start time cannot be after end time"
    end
    result = []
    current_time = start_date_time
    while current_time < end_date_time
      result << { start_date_time: current_time, end_date_time: current_time+30.minutes }
      current_time += 30.minutes
    end
    result
  end

  def parse_and_combine_date_time(date, time)
    Time.zone.parse(date).change(hour: time.to_i)
  end
end
