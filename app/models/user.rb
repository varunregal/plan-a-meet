class User < ApplicationRecord
  has_many :user_availabilities, dependent: :destroy
  has_many :events, through: :user_availabilities
  has_secure_password validations: false

  validates :name, presence: true
end
