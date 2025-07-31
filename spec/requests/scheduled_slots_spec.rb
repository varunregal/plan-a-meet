require 'rails_helper'

RSpec.describe 'ScheduledSlotsController', :inertia, type: :request do
  let(:valid_params) do
    {
      name: 'Bar Hopping',
      dates: ['2025-04-19T04:00:00.000Z', '2025-04-20T04:00:00.000Z', '2025-04-21T04:00:00.000Z'],
      start_time: '7',
      end_time: '9',
      time_zone: 'America/New_York'
    }
  end

  let(:user) { User.create!(name: 'Varun', email_address: 'varun@example.com', password: 'password') }

  before do
    allow(Current).to receive(:user).and_return(user)
    post session_path, params: { email_address: user.email_address, password: 'password' }
    post events_path, params: { event: valid_params }
  end

  describe 'GET /scheduled_slots' do
    it 'show current scheduled slots for an event' do
      get event_scheduled_slots_path(Event.last)

      expect(inertia.component).to eq 'ScheduledSlot/Index'
      expect(inertia.props[:event].attributes[:name]).to eq Event.last.name
    end
  end

  describe 'POST /scheduled_slots' do
    it 'create scheduled slots with valid params' do
      expect do
        post event_scheduled_slots_path(Event.last),
             params: { time_slot_id: Event.last.time_slots.first.id }
      end.to change(ScheduledSlot, :count).by(1)
      expect(response.parsed_body['data']['scheduled_slot']['time_slot_id']).to eq(Event.last.time_slots.first.id)
    end

    it 'cannot create scheduled slots with invalid url' do
      expect do
        post event_scheduled_slots_path(event_url: '12345678'),
             params: { time_slot_id: Event.last.time_slots.first.id }
      end.not_to change(ScheduledSlot, :count)
      expect(response.parsed_body['errors']).to eq("Couldn't find the current Event")
    end

    it 'cannot create scheduled slots with empty time slot' do
      expect do
        post event_scheduled_slots_path(event_url: Event.last),
             params: { time_slot_id: nil }
      end.not_to change(ScheduledSlot, :count)
      expect(response.parsed_body['errors']).to eq("Couldn't find the current TimeSlot")
    end

    it 'cannot create duplicated scheduled slots' do
      post event_scheduled_slots_path(Event.last), params: { time_slot_id: Event.last.time_slots.first.id }
      expect do
        post event_scheduled_slots_path(Event.last),
             params: { time_slot_id: Event.last.time_slots.first.id }
      end.not_to change(ScheduledSlot, :count)
      expect(response.parsed_body[:errors]).to eq('Validation failed: Time slot has already been taken')
    end
  end

  describe 'DELETE /scheduled_slots' do
    it 'delete scheduled slot with valid params' do
      post event_scheduled_slots_path(Event.last), params: { time_slot_id: Event.last.time_slots.first.id }
      expect do
        delete event_scheduled_slot_path(Event.last, ScheduledSlot.last)
      end.to change(ScheduledSlot, :count).by(-1)
    end
  end
end
