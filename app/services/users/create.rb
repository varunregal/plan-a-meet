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
      # availability = UserAvailability.create(user: user, event: event)
      Result.success(user)
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
end
