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
    let(:valid_attributes) do
      {
        name: 'Weekend Bar Hopping',
        dates: %w[2025-08-01 2025-08-02 2025-08-03],
        start_time: '18',
        end_time: '21',
        time_zone: 'America/New_York'
      }
    end

    it 'creates a new event' do
      expect { post events_path, params: valid_attributes }.to change(Event, :count).by(1)
    end
  end
end
