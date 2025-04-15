class TimeSlot < ApplicationRecord
  belongs_to :event
  has_many :user_availabilities, dependent: :destroy

  validates :start_time, presence: true
  validates :end_time, presence: true

  validate :start_time_is_less_than_end_time

  private
  def start_time_is_less_than_end_time
    if start_time && end_time && start_time >= end_time
      errors.add(:start_time, "start time must be earlier than end time")
    end
  end
end
