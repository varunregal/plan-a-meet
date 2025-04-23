class TimeSlotSerializer < ActiveModel::Serializer
  attributes :id, :start_time, :end_time, :event_id
end
