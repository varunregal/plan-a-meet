class AvailabilitySerializer < ActiveModel::Serializer
  attributes :id, :time_slot_id
  belongs_to :user
end
