require "time"
require "ostruct"
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
      create_time_slots_for_event(event)
      event.save!
      Result.success(event)
    rescue => e
      Result.failure(e)
    end
  end

  private
  def generate_time_slots
    start_date_time = parse_date_and_combine_with_time(@start_date, @start_time)
    end_date_time = parse_date_and_combine_with_time(@end_date, @end_time)

    start_date_time.step(end_date_time, (1.to_f/24/2)).map do |dt|
      { start_date_time: dt, end_date_time: dt + (1.to_f/24/2) }
    end
  end

  def create_time_slots_for_event(event)
    generate_time_slots.each do |time_slot|
      TimeSlot.create!(
        start_time: time_slot[:start_date_time],
        end_time: time_slot[:end_date_time],
        event: event
        )
    end
  end

  def parse_date_and_combine_with_time(date, time)
    DateTime.parse("#{Date.parse(date)} #{Time.zone.parse(time.to_s + ':00')}")
  end
end
