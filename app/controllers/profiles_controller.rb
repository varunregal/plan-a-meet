class ProfilesController < ApplicationController
  def show
    @events = Current.user.created_events.order(created_at: :desc)
    render inertia: 'Profile/Show', props: { events: @events.count }
  end
end
