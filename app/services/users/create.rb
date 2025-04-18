class Users::Create
  def initialize(params)
    puts params, "params", params[:url], "name", params[:name]
    @url = params[:url]
    @name = params[:name]
    @password = params[:password]
  end

  def perform
    ActiveRecord::Base.transaction do
      event = find_event
      user = find_and_create_user(event)
      availability = find_and_create_user_availability(event, user)
      Result.success({ availability: availability, event: event, user: user })
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
      User.create(name: @name, password: @password || nil)
    else
      user
    end
  end

  def find_and_create_user_availability(event, user)
    availability = UserAvailability.find_by(event: event, user: user)
    if !availability
      UserAvailability.create(event: event, user: user)
    else
      availability
    end
  end
end
