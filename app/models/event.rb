class Event < ApplicationRecord
  has_many :time_slots, dependent: :destroy

  validates :name, presence: true
  validates :url, presence: true, uniqueness: true
end
