class UserAvailabilities::Create
  def initialize(event, params)
    @event = event
    @user_id = params.fetch(:user_id)
    @time_slots = params.fetch(:time_slots)
  end

  def perform
    user = find_user
    availabilities = create_availabilities(user)
    Result.success({ availabilities: })
  rescue => e
    Result.failure(e)
  end

  private
  def find_user
    User.find(@user_id)
  end
  def create_availabilities(user)
    created_slot_ids = []
    UserAvailability.transaction do
      @time_slots.each do |slot_id|
        time_slot = @event.time_slots.find(slot_id)
        UserAvailability.create!(event: @event, user: user, time_slot: time_slot)
        created_slot_ids << slot_id
      end
    end
    created_slot_ids
  end
end
