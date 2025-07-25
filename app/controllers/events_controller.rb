class EventsController < ApplicationController
  allow_unauthenticated_access only: %i[new]
  def new
    render inertia: 'Event/New'
  end
end
