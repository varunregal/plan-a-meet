require 'rails_helper'

RSpec.describe 'AvailabilitiesController', type: :request do
  let(:user) { create(:user) }
  let(:event) { create(:event) }
  let(:time_slot) do
    create(:time_slot,
           event: event,
           start_time: '2024-01-15 09:00',
           end_time: '2024-01-15 09:15')
  end
  let(:time_slot2) do
    create(:time_slot,
           event: event,
           start_time: '2024-01-15 09:15',
           end_time: '2024-01-15 09:30')
  end

  describe 'GET /events/:url/availabilities' do
    context 'when authenticated' do
      before { sign_in_as(user) }

      it 'returns availability data for the event' do
        user2 = create(:user, name: 'Jane Doe')
        create(:availability, user: user, time_slot: time_slot)
        create(:availability, user: user2, time_slot: time_slot)
        create(:availability, user: user2, time_slot: time_slot2)

        get event_availabilities_path(event_url: event.url)
        expect(response).to have_http_status(:success)
        json = response.parsed_body

        # Check the date-hour-minute key format
        date_key = time_slot.start_time.strftime('%a %b %d %Y') # "Tue Jan 15 2024"
        key1 = "#{date_key}-9-0"
        key2 = "#{date_key}-9-15"

        expect(json['availability_data'][key1]).to contain_exactly(user.name, user2.name)
        expect(json['availability_data'][key2]).to contain_exactly(user2.name)
        expect(json['current_user_slots']).to contain_exactly(time_slot.id)
      end
    end
  end
end
