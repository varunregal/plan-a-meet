require 'rails_helper'
require 'pry'
RSpec.describe 'EventsController', :inertia, type: :request do
  describe 'GET /events/new' do
    it 'renders the new event form' do
      get new_event_path
      expect(response).to have_http_status(:success)

      expect(inertia.component).to eq 'Event/New'
    end
  end

  describe 'POST /events' do
    context 'without authentication and valid_params' do
      let(:valid_params) do
        {
          name: 'Weekend Bar Hopping',
          dates: %w[2025-08-01],
          start_time: '03:00',
          end_time: '04:00',
          time_zone: 'America/New_York'
        }
      end

      it 'creates a new event' do
        expect { post events_path, params: valid_params }.to change(Event, :count).by(1)
      end

      it 'creates time slots for the event' do
        expect { post events_path, params: valid_params }.to change(TimeSlot, :count).by(4)
      end

      it 'redirects to the created event' do
        post events_path, params: valid_params
        event = Event.last
        expect(response).to redirect_to event_path(event)
      end
    end

    context 'with authentication and valid_params' do
      let(:valid_params) do
        {
          name: 'Weekend Bar Hopping',
          dates: %w[2025-08-01],
          start_time: '03:00',
          end_time: '04:00',
          time_zone: 'America/New_York'
        }
      end
      let(:user) { create(:user) }

      before { sign_in_as(user) }

      it 'assigns the current user as event creator' do
        post events_path, params: valid_params
        event = Event.last
        expect(event.event_creator).to eq user
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) do
        {
          name: '',
          dates: ['2025-08-01'],
          start_time: '03:00',
          end_time: '04:00',
          time_zone: 'America/New_York'
        }
      end

      it 'does not create an event' do
        expect { post events_path, params: invalid_params }.not_to change(Event, :count)
      end

      it 'does not create any time slots' do
        expect { post events_path, params: invalid_params }.not_to change(TimeSlot, :count)
      end
    end

    context 'when time slot creation fails' do
      let(:valid_params) do
        {
          name: 'Team Meeting',
          dates: ['2025-08-01'],
          start_time: '09:00',
          end_time: '10:00',
          time_zone: 'America/New_York'
        }
      end

      before do
        allow_any_instance_of(Event).to receive(:create_time_slots).with(
          { dates: ['2025-08-01'],
            start_time: '09:00',
            end_time: '10:00',
            time_zone: 'America/New_York' }
        ).and_raise(StandardError, 'Time slots creation failed')
      end

      it 'rolls back event creation when time slot creation fails' do
        expect { post events_path, params: valid_params }.not_to change(Event, :count)
      end

      it 'redirects to new event path with error message' do
        post events_path, params: valid_params
        expect(response).to redirect_to(new_event_path)
      end

      it 'does not create any time slots when creation fails' do
        expect { post events_path, params: valid_params }.not_to change(TimeSlot, :count)
      end
    end
  end
end
