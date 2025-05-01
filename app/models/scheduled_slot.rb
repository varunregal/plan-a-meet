class ScheduledSlot < ApplicationRecord
  belongs_to :event
  belongs_to :time_slot
end
