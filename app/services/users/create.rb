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
      Result.success({ availability: ActiveModelSerializers::SerializableResource.new(availability, each_serializer: UserAvailabilitySerializer), user: UserSerializer.new(user), users: })
    rescue => e
      Result.failure(e)
    end
  end

  private
  def find_event
    Event.find_by(url: @url)
  end

  def find_and_create_user(event)
    user = User.find_by(name: @name)
    if !user
      User.create!(name: @name, password: @password || nil)
    else
      user
    end
  end

  def find_and_create_user_availability(event, user)
    availability = UserAvailability.includes(:user, :event).where(event: event, user: user)
    if availability.count == 0
      UserAvailability.create!(event: event, user: user)
    else
      availability
    end
  end
end
