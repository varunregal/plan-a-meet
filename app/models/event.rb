class Event < ApplicationRecord
  has_many :time_slots, dependent: :destroy
  has_many :user_availabilities, dependent: :destroy
  has_many :users, through: :user_availabilities, dependent: :destroy

  validates :name, presence: true
  validates :url, presence: true, uniqueness: true

  def to_param
    url
  end
end
