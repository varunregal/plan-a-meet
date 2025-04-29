class Event < ApplicationRecord
  has_many :time_slots, dependent: :destroy
  belongs_to :event_creator, class_name: "User", inverse_of: :created_events, optional: true
  # has_many :user_availabilities, dependent: :destroy
  # has_many :users, through: :user_availabilities, dependent: :destroy


  validates :name, presence: true
  validates :url, presence: true, uniqueness: true

  def to_param
    url
  end
end
