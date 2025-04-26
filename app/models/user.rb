class User < ApplicationRecord
  has_secure_password validations: false
  has_many :sessions, dependent: :destroy

  validates :name, presence: true
  validates :email_address, uniqueness: true
  validates :password, length: { minimum: 8 }, allow_blank: true
  normalizes :email_address, with: ->(e) { e.strip.downcase }

  has_many :user_availabilities, dependent: :destroy
  has_many :events, through: :user_availabilities
end
