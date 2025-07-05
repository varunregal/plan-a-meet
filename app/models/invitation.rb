class Invitation < ApplicationRecord
  belongs_to :event
  belongs_to :inviter
  belongs_to :invitee
end
