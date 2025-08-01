class AvailabilitiesController < ApplicationController
  allow_unauthenticated_access only: %i[index create]
  def index
    event = Event.find_by!(url: params[:event_url])
    availabilities = Availability.joins(:time_slot)
                                 .where(time_slots: { event_id: event.id })
                                 .includes(:user, :time_slot)
    availability_data = availabilities.each_with_object({}) do |availability, hash|
      slot = availability.time_slot
      date_key = slot.start_time.strftime('%a %b %d %Y')
      hour = slot.start_time.hour
      minute = slot.start_time.min
      key = "#{date_key}-#{hour}-#{minute}"
      name = availability.user ? availability.user.name : availability.participant_name
      hash[key] ||= []
      hash[key] << name
    end
    current_user_slots = if authenticated?
                           Current.user.availabilities
                                  .joins(:time_slot)
                                  .where(time_slots: { event_id: event.id })
                                  .pluck(:time_slot_id)
                         elsif cookies.signed[:anonymous_session_id].present?
                           Availability.joins(:time_slot)
                                       .where(time_slots: { event_id: event.id })
                                       .where(anonymous_session_id: cookies.signed[:anonymous_session_id])
                                       .pluck(:time_slot_id)
                         else
                           []
                         end

    render json: {
      availability_data: availability_data,
      current_user_slots: current_user_slots
    }
  end

  def create
    event = Event.find_by!(url: params[:event_url])
    time_slots_ids = (params[:time_slot_ids] || []).compact_blank

    ActiveRecord::Base.transaction do
      if authenticated?
        Current.user.availabilities.joins(:time_slot).where(time_slots: { event_id: event.id }).destroy_all
        time_slots_ids.each do |slot_id|
          time_slot = event.time_slots.find(slot_id)
          Current.user.availabilities.create!(time_slot:)
        end
      elsif params[:participant_name].present?
        participant_name = params[:participant_name]
        anonymous_session_id = cookies.signed[:anonymous_session_id] || SecureRandom.hex(16)
        store_anonymous_session_cookie(anonymous_session_id) if cookies.signed[:anonymous_session_id].blank?
        Availability.joins(:time_slot)
                    .where(time_slots: { event_id: event.id })
                    .where(anonymous_session_id:).destroy_all

        time_slots_ids.each do |slot_id|
          time_slot = event.time_slots.find(slot_id)
          Availability.create!(time_slot:, anonymous_session_id:, participant_name:)
        end
      else
        render json: { errors: ['Participant name is required'] }, status: :unprocessable_entity
        return
      end
    end
    head :ok
  rescue ActiveRecord::RecordNotFound
    render json: { errors: ['Invalid time slot'] }, status: :unprocessable_entity
  end
end
