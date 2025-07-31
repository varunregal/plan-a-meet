class UserAvailabilities::Create
  def initialize(event, params)
    @event = event
    @user_id = params.fetch(:user_id)
    @time_slot = params.fetch(:time_slot)
  end

  def perform
    user = find_user
    availability = create_availabilities(user)
    Result.success({ availability: UserAvailabilitySerializer.new(availability) })
  rescue StandardError => e
    Result.failure(e)
  end

  private

  def find_user
    User.find(@user_id)
  end

  def create_availabilities(user)
    UserAvailability.transaction do
      time_slot = @event.time_slots.find(@time_slot)
      UserAvailability.create!(event: @event, user: user, time_slot:)
    end
  end
end
