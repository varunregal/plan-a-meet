class EventService
  def initialize(params)
    @name = params[:name]
    @start_date = params[:start_date]
    @end_date = params[:end_date]
    @start_time = params[:start_time]
    @end_time = params[:end_time]
  end

  def create_time_slots_and_event
  end

  private
  def event_params
    params.expect(event: [ :name, :url, time_slot_attributes: [ :start_time, :end_time ] ])
  end
  def time_slot_params
    params.expect(time_slot: [ :start_time, :end_time, :event_id ])
  end
end
