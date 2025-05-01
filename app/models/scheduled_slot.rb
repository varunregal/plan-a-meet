class ScheduledSlot < ApplicationRecord
  belongs_to :event
  belongs_to :time_slot

  validates :time_slot_id, uniqueness: { scope: :event_id }
end
