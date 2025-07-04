class UsersController < ApplicationController
  def index; end

  private

  def set_event
    Event.find_by(url: params[:url])
  end
end
