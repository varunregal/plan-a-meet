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

    context 'with invalid event parameters' do
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

      it 'returns validation errors via Inertia' do
        post events_path, params: invalid_params
        expect(response).to redirect_to(new_event_path)
        follow_redirect!
        expect(inertia.props[:errors]).to be_present
        expect(inertia.props[:errors]['name']).to include("can't be blank")
      end
    end

    context 'with invalid time slot parameters' do
      let(:invalid_params) do
        {
          name: 'Team Meeting',
          dates: [],
          start_time: '03:00',
          end_time: '04:00',
          time_zone: 'America/New_York'
        }
      end

      it 'does not create an event' do
        expect { post events_path, params: invalid_params }.not_to change(Event, :count)
      end

      it 'returns error message' do
        post events_path, params: invalid_params
        expect(response).to redirect_to new_event_path
        follow_redirect!
        expect(inertia.props[:errors]['base']).to include('Missing required parameters')
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

  describe 'GET /events/:url' do
    let(:event) { create(:event) }

    context 'when event exists' do
      it 'returns success and renders show page' do
        get event_path(event)
        expect(response).to have_http_status(:success)
        expect(inertia.component).to eq 'Event/Show'
        expect(inertia.props[:id]).to eq event.id
        expect(inertia.props[:name]).to eq event.name
      end

      it 'includes time slots data' do
        time_slot = create(:time_slot, event:)
        get event_path(event)
        expect(inertia.props[:time_slots]).to be_an Array
        expect(inertia.props[:time_slots].length).to eq 1
        expect(inertia.props[:time_slots].first['id']).to eq time_slot.id
        expect(inertia.props[:time_slots].first['start_time']).to be_present
      end
    end

    context 'when event does not exist' do
      it 'returns 404 not found' do
        get event_path('nonexistent')
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'anonymouse session tracking' do
    it 'does not set anonymous session when just viewing an event' do
      event = create(:event)

      get event_path(event)
      jar = ActionDispatch::Cookies::CookieJar.build(request, cookies.to_hash)
      expect(jar.signed[:anonymous_session_id]).to be_nil
    end

    it 'sets anonymous session when creating an event' do
      post events_path, params: {
        name: 'Team Meeting',
        dates: ['2025-08-01'],
        start_time: '09:00',
        end_time: '10:00',
        time_zone: 'America/New_York'
      }

      jar = ActionDispatch::Cookies::CookieJar.build(request, cookies.to_hash)
      expect(jar.signed[:anonymous_session_id]).to be_present
    end

    it 'does not set anonymous session for authenticated users creating events' do
      user = create(:user)
      sign_in_as(user)

      post events_path, params: {
        name: 'Team Meeting',
        dates: ['2025-08-01'],
        start_time: '09:00',
        end_time: '10:00',
        time_zone: 'America/New_York'
      }

      jar = ActionDispatch::Cookies::CookieJar.build(request, cookies.to_hash)
      expect(jar.signed[:anonymous_session_id]).to be_nil
    end
  end
end
