class TimeSlot < ApplicationRecord
  belongs_to :event
  has_many :availabilities, dependent: :destroy
  has_many :users, through: :availabilities
  has_many :scheduled_slots, dependent: :destroy

  validates :start_time, presence: true
  validates :end_time, presence: true

  validate :start_time_before_end_time

  private

  def start_time_before_end_time
    return unless start_time && end_time

    return unless start_time >= end_time

    errors.add(:start_time, 'must be before end time')
  end
end
