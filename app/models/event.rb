class Event < ApplicationRecord
  has_many :time_slots
  
  validates_presence_of :name
  validates :url, presence: true, uniqueness: true
end
