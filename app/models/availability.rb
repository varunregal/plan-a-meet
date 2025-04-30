class Availability < ApplicationRecord
  belongs_to :user
  belongs_to :time_slot

  validates :time_slot_id, uniqueness: { scope: :user_id }
end
