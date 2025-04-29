class EventSerializer < ActiveModel::Serializer
  attributes :id, :name, :url, :event_creator_id
  has_many :time_slots
end
