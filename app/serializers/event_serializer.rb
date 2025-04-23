class EventSerializer < ActiveModel::Serializer
  attributes :id, :name, :url
  has_many :time_slots
end
