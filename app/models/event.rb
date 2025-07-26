class Event < ApplicationRecord
  has_many :time_slots, dependent: :destroy
  belongs_to :event_creator, class_name: 'User', inverse_of: :created_events, optional: true
  has_many :availabilities, through: :time_slots
  has_many :users, through: :availabilities
  has_many :scheduled_slots, dependent: :destroy
  has_many :scheduled_time_slots, through: :scheduled_slots, source: :time_slot
  has_many :invitations, dependent: :destroy

  validates :name, presence: true
  validates :url, uniqueness: true
  before_validation :generate_url_token, on: :create

  def to_param
    url
  end

  def create_time_slots(dates:, start_time:, end_time:, time_zone:)
    Time.use_zone(time_zone) do
      dates.each do |date|
        start_datetime = Time.zone.parse("#{date} #{start_time}:00")
        end_datetime = Time.zone.parse("#{date} #{end_time}:00")
        current_time = start_datetime

        while current_time < end_datetime
          time_slots.create!(
            start_time: current_time,
            end_time: current_time + 15.minutes
          )
          current_time += 15.minutes
        end
      end
    end
  end

  private

  def generate_url_token
    return if url.present?

    loop do
      self.url = SecureRandom.alphanumeric(8).downcase
      break unless Event.exists?(url:)
    end
  end
end
