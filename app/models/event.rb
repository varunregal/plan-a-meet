class Event < ApplicationRecord
  has_many :time_slots, dependent: :destroy
  has_many :users, dependent: :destroy

  validates :name, presence: true
  validates :url, presence: true, uniqueness: true
end
