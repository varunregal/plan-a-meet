class User < ApplicationRecord
  has_many :user_availabilities, dependent: :destroy
  has_secure_password validations: false
  validates :name, presence: true
end
