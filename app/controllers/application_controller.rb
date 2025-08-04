require 'pry'
class ApplicationController < ActionController::Base
  include Authentication
  include ApiErrorHandler
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  inertia_share flash: -> { flash.to_hash }, current_user: lambda {
    Current.user.as_json(only: %i[id name email_address]) if Current.user
  }, availability_conflict: -> { session.delete(:availability_conflict) }
  # allow_browser versions: :modern

  private

  def inertia_errors(model, full_messages: true)
    model.errors.to_hash(full_messages).transform_values(&:to_sentence)
  end

  def convert_anonymous_to_authenticated(user)
    return if cookies.signed[:anonymous_session_id].blank?

    anonymous_session_id = cookies.signed[:anonymous_session_id]
    all_anonymous_availabilities = Availability.where(anonymous_session_id:)
    if all_anonymous_availabilities.exists?

      events_with_anonymous_availability = all_anonymous_availabilities
                                           .joins(:time_slot)
                                           .select('DISTINCT time_slots.event_id')
                                           .pluck('time_slots.event_id')
      events_with_anonymous_availability.each do |event_id|
        user_slots = user.availabilities
                         .joins(:time_slot)
                         .where(time_slots: { event_id: })
                         .pluck(:time_slot_id)
        anonymous_slots = all_anonymous_availabilities
                          .joins(:time_slot)
                          .where(time_slots: { event_id: })
                          .pluck(:time_slot_id)
        next unless user_slots.intersect?(anonymous_slots)

        event = Event.find(event_id)
        return {
          has_conflict: true,
          event_name: event.name,
          event_url: event.url,
          authenticated_slots: user_slots.count,
          anonymous_slots: anonymous_slots.count,
          conflicting_slots: (user_slots & anonymous_slots).count,
          anonymous_session_id:
        }
      end
    end

    ActiveRecord::Base.transaction do
      Event.where(anonymous_session_id:).find_each do |event|
        event.update(event_creator_id: user.id, anonymous_session_id: nil)
      end
      Availability.where(anonymous_session_id:).find_each do |availability|
        availability.update(user_id:, anonymous_session_id: nil)
      end
    end
    cookies.delete(:anonymous_session_id)
    nil
  end

  def store_anonymous_session_cookie(value)
    cookies.signed[:anonymous_session_id] ||= {
      value:,
      expires: 30.days.from_now,
      httponly: true,
      same_site: :lax
    }
  end
end
