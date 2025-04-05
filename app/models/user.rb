class User < ApplicationRecord
  has_secure_password
  belongs_to :event
  validates :name, presence: true, uniqueness: { scope: :event_id }
end
