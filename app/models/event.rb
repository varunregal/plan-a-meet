class Event < ApplicationRecord
  has_many :time_slots, dependent: :destroy
  belongs_to :event_creator, class_name: 'User', inverse_of: :created_events, optional: true
  has_many :availabilities, through: :time_slots
  has_many :users, through: :availabilities
  has_many :scheduled_slots, dependent: :destroy
  has_many :scheduled_time_slots, through: :scheduled_slots, source: :time_slot

  validates :name, presence: true
  validates :url, presence: true, uniqueness: true

  def to_param
    url
  end
end
