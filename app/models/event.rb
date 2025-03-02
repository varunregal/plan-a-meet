class Event < ApplicationRecord
  validates_presence_of :name
  validates :url, presence: true, uniqueness: true
end
