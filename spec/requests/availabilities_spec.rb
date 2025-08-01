require 'rails_helper'
require 'pry'

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

        date_key = time_slot.start_time.strftime('%a %b %d %Y')
        key1 = "#{date_key}-9-0"
        key2 = "#{date_key}-9-15"

        expect(json['availability_data'][key1]).to contain_exactly(user.name, user2.name)
        expect(json['availability_data'][key2]).to contain_exactly(user2.name)
        expect(json['current_user_slots']).to contain_exactly(time_slot.id)
      end
    end

    context 'when not authenticated' do
      it 'returna availability data without current user info' do
        other_user = create(:user, name: 'Other user')
        create(:availability, user: other_user, time_slot:)
        create(:availability, user: nil, anonymous_session_id: 'xyz789', participant_name: 'Anonymous Person',
                              time_slot:)
        get event_availabilities_path(event_url: event.url)
        expect(response).to have_http_status(:success)
        json = response.parsed_body

        date_key = time_slot.start_time.strftime('%a %b %d %Y')
        key = "#{date_key}-9-0"
        expect(json['availability_data']).to be_present
        expect(json['availability_data'][key]).to contain_exactly('Anonymous Person', 'Other user')
        expect(json['current_user_slots']).to eq([])
      end

      it 'handles anonymous user availability' do
        create(:availability, user: nil, anonymous_session_id: 'abc123', participant_name: 'Anonymous User', time_slot:)
        get event_availabilities_path(event_url: event.url)
        json = response.parsed_body

        date_key = time_slot.start_time.strftime('%a %b %d %Y')
        key = "#{date_key}-9-0"
        expect(json['availability_data'][key]).to include('Anonymous User')
      end

      it 'returns 404 for non-existent event' do
        get event_availabilities_path(event_url: 'non-existent')

        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST /events/:url/availabilities' do
    context 'when authenticated' do
      before { sign_in_as(user) }

      it 'replaces all the user availabilities for the event' do
        old_availability = create(:availability, user:, time_slot:)
        expect do
          post event_availabilities_path(event_url: event.url),
               params: { time_slot_ids: [time_slot2.id] }
        end.not_to change(Availability, :count)

        expect(response).to have_http_status(:ok)

        expect(Availability.find_by(id: old_availability.id)).to be_nil
        expect(user.availabilities.pluck(:time_slot_id)).to eq([time_slot2.id])
      end

      it 'creates multiple availabilities at once' do
        expect do
          post event_availabilities_path(event_url: event.url), params: { time_slot_ids: [time_slot.id, time_slot2.id] }
        end.to change(Availability, :count).by(2)
        expect(response).to have_http_status(:ok)
        expect(user.availabilities.pluck(:time_slot_id)).to contain_exactly(time_slot.id, time_slot2.id)
      end

      it 'clears all availabilities when empty array provided' do
        create(:availability, user:, time_slot:)
        expect do
          post event_availabilities_path(event_url: event.url), params: { time_slot_ids: [] }
        end.to change(Availability, :count).by(-1)
        expect(response).to have_http_status(:ok)
        expect(user.availabilities.count).to eq(0)
      end

      it 'handles invalid time slot ids' do
        post event_availabilities_path(event_url: event.url), params: { time_slot_ids: [9999] }
        expect(response).to have_http_status(:unprocessable_entity)
        json = response.parsed_body
        expect(json['errors']).to include('Invalid time slot')
      end
    end

    context 'when not authenticated' do
      it 'if participant name is not present' do
        expect do
          post event_availabilities_path(event_url: event.url),
               params: { time_slot_ids: [time_slot.id], participant_name: nil }
        end.not_to change(Availability, :count)

        expect(response).to have_http_status(:unprocessable_entity)

        json = response.parsed_body
        expect(json[:errors]).to include 'Participant name is required'
      end

      it 'updates existing anonymous user availabilities' do
        post event_availabilities_path(event_url: event.url),
             params: { time_slot_ids: [time_slot.id], participant_name: 'John' }
        anonymous_session_id = Availability.last.anonymous_session_id
        expect do
          post event_availabilities_path(event_url: event.url),
               params: { time_slot_ids: [time_slot2.id], participant_name: 'John' }
        end.not_to change(Availability, :count)
        expect(response).to have_http_status(:ok)
        expect(Availability.where(anonymous_session_id:).pluck(:time_slot_id)).to eq([time_slot2.id])
      end

      it 'creates anonymous session for new users' do
        expect do
          post event_availabilities_path(event_url: event.url),
               params: { time_slot_ids: [time_slot.id], participant_name: 'John' }
        end.to change(Availability, :count).by(1)
        availability = Availability.last
        expect(availability.participant_name).to eq 'John'
        expect(availability.time_slot_id).to eq time_slot.id
      end

      it 'check anonymous session id for new users' do
        post event_availabilities_path(event_url: event.url),
             params: { time_slot_ids: [time_slot.id], participant_name: 'John' }
        availability = Availability.last
        expect(availability.anonymous_session_id).to be_present
        expect(response.cookies['anonymous_session_id']).to be_present
      end

      it 'handles invalid time slot ids for anonymous users' do
        post event_availabilities_path(event_url: event.url),
             params: { time_slot_ids: [9999], participant_name: 'John' }
        expect(response).to have_http_status(:unprocessable_entity)
        json = response.parsed_body
        expect(json['errors']).to include('Invalid time slot')
      end

      it 'clears all availabilities for anonymous user when empty array provided' do
        post event_availabilities_path(event_url: event.url),
             params: { time_slot_ids: [time_slot.id], participant_name: 'John' }
        expect do
          post event_availabilities_path(event_url: event.url), params: { time_slot_ids: [], participant_name: 'John' }
        end.to change(Availability, :count).by(-1)
        expect(response).to have_http_status(:ok)
        expect(user.availabilities.count).to eq(0)
      end
    end
  end
end
