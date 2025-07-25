class Event < ApplicationRecord
  has_many :time_slots, dependent: :destroy
  belongs_to :event_creator, class_name: 'User', inverse_of: :created_events, optional: true
  has_many :availabilities, through: :time_slots
  has_many :users, through: :availabilities
  has_many :scheduled_slots, dependent: :destroy
  has_many :scheduled_time_slots, through: :scheduled_slots, source: :time_slot
  has_many :invitations, dependent: :destroy

  validates :name, presence: true
  validates :url, uniqueness: true
  before_validation :generate_url_token, on: :create

  def to_param
    url
  end

  private

  def generate_url_token
    return if url.present?

    loop do
      self.url = SecureRandom.alphanumeric(8).downcase
      break unless Event.exists?(url:)
    end
  end
end
