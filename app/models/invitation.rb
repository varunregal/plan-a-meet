class Invitation < ApplicationRecord
  has_secure_token :invitation_token, length: 24, on: :create
  belongs_to :event
  belongs_to :inviter, class_name: 'User'
  belongs_to :invitee, class_name: 'User', optional: true

  validates :email_address, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :email_address, uniqueness: { scope: :event_id, message: 'has already been invited to this event' }
  before_validation :normalize_email

  validates :status, inclusion: { in: %w[pending accepted declined] }
  scope :pending, -> { where(status: 'pending') }
  scope :accepted, -> { where(status: 'accepted') }

  def accept!(user)
    update!(status: 'accepted', invitee: user)
  end

  def decline!
    update!(status: 'declined')
  end

  private

  def normalize_email
    self.email_address = email_address&.downcase&.strip
  end
end
