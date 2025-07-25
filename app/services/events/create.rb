require 'time'
require 'pry'
class Events::Create
  def initialize(params, current_user:)
    @name = params.fetch(:name)
    @dates = params.fetch(:dates)
    @start_time = params.fetch(:start_time)
    @end_time = params.fetch(:end_time)
    @time_zone = params.fetch(:time_zone)
    @user = current_user
  end

  def create_time_slots_and_event
    ActiveRecord::Base.transaction do
      event = Event.new(name: @name, url: generate_unique_event_url, event_creator: @user)
      create_time_slots(event)
      event.save!
      Result.success(event)
    end
  rescue StandardError => e
    Result.failure(e)
  end

  private

  def create_time_slots(event)
    time_slots = generate_time_slots
    time_slots.each do |slot|
      event.time_slots.build(start_time: slot[:start_date_time], end_time: slot[:end_date_time])
    end
  end

  def generate_time_slots
    result = []
    @dates.each do |d|
      start_date_time = parse_and_combine_date_time(d.to_s, @start_time)
      end_date_time = parse_and_combine_date_time(d.to_s, @end_time)
      raise ArgumentError, 'Start Date cannot be before End Date' if end_date_time < start_date_time

      while start_date_time < end_date_time
        result << { start_date_time: start_date_time, end_date_time: start_date_time + 15.minutes }
        start_date_time += 15.minutes
      end
    end
    result
  end

  def parse_and_combine_date_time(date, time)
    Time.use_zone(@time_zone) do
      Time.zone.parse(date).change(hour: time.to_i)
    end
  end

  def generate_unique_event_url
    loop do
      url = SecureRandom.base64(8).gsub('/', '_').gsub(/=+$/, '')
      return url unless Event.exists?(url: url)
    end
  end
end
