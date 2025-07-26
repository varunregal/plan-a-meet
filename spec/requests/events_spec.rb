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

  describe 'POST /evens' do
    let(:valid_params) do
      {
        name: 'Weekend Bar Hopping',
        dates: %w[2025-08-01],
        start_time: '03:00',
        end_time: '04:00',
        time_zone: 'America/New_York'
      }
    end

    context 'without authentication' do
      it 'creates a new event' do
        expect { post events_path, params: valid_params }.to change(Event, :count).by(1)
      end

      it 'creates time slots for the event' do
        expect { post events_path, params: valid_params }.to change(TimeSlot, :count).by(4)
      end
    end

    context 'with authentication' do
      let(:user) { create(:user) }

      before { sign_in_as(user) }

      it 'assigns the current user as event creator' do
        post events_path, params: valid_params
        event = Event.last
        expect(event.event_creator).to eq user
      end
    end
  end
end
