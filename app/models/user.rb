class User < ApplicationRecord
  has_secure_password validations: false
  belongs_to :event
  validates :name, presence: true, uniqueness: { scope: :event_id }
end
