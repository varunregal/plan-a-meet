class Users::Create
  def initialize(params)
    @url = params[:url]
    @name = params[:name]
    @password = params[:password]
  end

  def perform
    ActiveRecord::Base.transaction do
      event = find_event
      user = find_and_create_user(event)
      availability = find_and_create_user_availability(event, user)
      users = event.users.reload.distinct
      Result.success({
                       availability: ActiveModelSerializers::SerializableResource.new(availability,
                                                                                      each_serializer: UserAvailabilitySerializer), user: UserSerializer.new(user), users:
                     })
    rescue StandardError => e
      Result.failure(e)
    end
  end

  private

  def find_event
    Event.find_by(url: @url)
  end

  def find_and_create_user(_event)
    user = User.find_by(name: @name)
    user || User.create!(name: @name, password: @password || nil)
  end

  def find_and_create_user_availability(event, user)
    availability = UserAvailability.includes(:user, :event).where(event: event, user: user)
    if availability.count.zero?
      UserAvailability.create!(event: event, user: user)
    else
      availability
    end
  end
end
