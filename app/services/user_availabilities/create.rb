class UserAvailabilities::Create
  def initialize(params)
    @url = params.fetch(:url)
    @user_id = params.fetch(:user_id)
    @time_slots = params.fetch(:time_slots)
  end

  def perform
    event = find_event
    user = find_user
    create_availabilities(event, user)
    Result.success({ data: "Time stored" })
  end
  private
  def find_event
    Event.find_by(url: @url)
  end
  def find_user
    User.find(@user_id)
  end
  def create_availabilities(event, user)
    @time_slots.each do |slot|
      UserAvailability.create(event: event, user: user, time_slot: TimeSlot.find(slot))
    end
  end
end
