class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy

  has_many :user_availabilities, dependent: :destroy
  has_many :events, through: :user_availabilities

  normalizes :email_address, with: ->(e) { e.strip.downcase }
end
