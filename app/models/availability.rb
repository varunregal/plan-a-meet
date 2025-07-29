class Availability < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :time_slot

  validates :time_slot_id, uniqueness: { scope: :user_id }, if: :user_id?
  validates :time_slot_id, uniqueness: { scope: :anonymous_session_id }, if: :anonymous_session_id?

  validate :user_or_anonymous_present
  validate :anonymous_has_name

  private

  def user_or_anonymous_present
    return unless user.blank? && anonymous_session_id.blank?

    errors.add(:base, 'Either user or anonymous session must be present')
  end

  def anonymous_has_name
    return unless anonymous_session_id.present? && participant_name.blank?

    errors.add(:participant_name, 'is required for anonymous users')
  end
end
