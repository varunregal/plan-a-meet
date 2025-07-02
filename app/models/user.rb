class User < ApplicationRecord
  has_secure_password validations: false
  has_many :sessions, dependent: :destroy

  validates :name, presence: true
  validates :email_address, uniqueness: true, allow_blank: true
  validates :password, length: { minimum: 8 }, allow_blank: true
  before_validation :normalize_email
  validates :email_address, presence: true, uniqueness: { case_sensitive: false }
  validates :email_address, format: { with: URI::MailTo::EMAIL_REGEXP }, if: :email_address?

  has_many :created_events, class_name: "Event", foreign_key: "event_creator_id", inverse_of: :event_creator, dependent: :nullify
  has_many :availabilities, dependent: :destroy
  has_many :time_slots, through: :availabilities

  private

  def normalize_email
    self.email_address = email_address&.downcase&.strip
  end
end
