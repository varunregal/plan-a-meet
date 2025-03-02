class TimeSlot < ApplicationRecord
  belongs_to :event

  validates_presence_of :start_time
  validates_presence_of :end_time

  validate :start_time_is_less_than_end_time

  private
  def start_time_is_less_than_end_time
    if start_time && end_time && start_time >= end_time
      errors.add(:start_time, "start time must be earlier than end time")
    end
  end
end
