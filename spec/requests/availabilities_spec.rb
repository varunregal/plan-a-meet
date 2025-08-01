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

    context 'with timezone handling' do
      let(:user) { create(:user) }

      context 'when event has a specific timezone' do
        let(:event_ny) { create(:event, time_zone: 'America/New_York') }

        it 'returns availability keys in the event timezone' do
          utc_time = Time.parse('2024-01-15 14:00:00 UTC')
          time_slot_ny = create(:time_slot, event: event_ny, start_time: utc_time, end_time: utc_time + 15.minutes)
          create(:availability, user:, time_slot: time_slot_ny)

          get event_availabilities_path(event_url: event_ny.url)
          expect(response).to have_http_status(:success)
          json = response.parsed_body
          expected_key = 'Mon Jan 15 2024-9-0'
          expect(json[:availability_data]).to have_key(expected_key)
          expect(json[:availability_data][expected_key]).to include(user.name)
        end
      end

      context 'when event has no timezone (defaults to UTC)' do
        let(:event_no_tz) { create(:event) }

        it 'returns availability keys in UTC' do
          utc_time = Time.parse('2024-01-15 14:00:00 UTC')
          time_slot_utc = create(:time_slot, event: event_no_tz, start_time: utc_time, end_time: utc_time + 15.minutes)
          create(:availability, user:, time_slot: time_slot_utc)

          get event_availabilities_path(event_url: event_no_tz.url)
          expect(response).to have_http_status(:success)
          json = response.parsed_body
          expected_key = 'Mon Jan 15 2024-14-0'
          expect(json[:availability_data]).to have_key(expected_key)
          expect(json[:availability_data][expected_key]).to include(user.name)
        end
      end

      context 'when handling daylight saving time' do
        let(:event_la) { create(:event, time_zone: 'America/Los_Angeles') }

        it 'correctly handles PST (winter time)' do
          # Jan PST (UTC - 8)
          winter_time = Time.parse('2024-01-15 20:00:00 UTC')
          time_slot_winter = create(:time_slot, event: event_la, start_time: winter_time,
                                                end_time: winter_time + 15.minutes)
          create(:availability, user:, time_slot: time_slot_winter)
          get event_availabilities_path(event_url: event_la.url)
          json = response.parsed_body
          expected_key = 'Mon Jan 15 2024-12-0'
          expect(json[:availability_data]).to have_key(expected_key)
        end

        it 'correctly handles PST (summer time)' do
          # Jan PST (UTC - 7)
          winter_time = Time.parse('2024-07-15 20:00:00 UTC')
          time_slot_winter = create(:time_slot, event: event_la, start_time: winter_time,
                                                end_time: winter_time + 15.minutes)
          create(:availability, user:, time_slot: time_slot_winter)
          get event_availabilities_path(event_url: event_la.url)
          json = response.parsed_body
          expected_key = 'Mon Jul 15 2024-13-0'
          expect(json[:availability_data]).to have_key(expected_key)
        end
      end

      context 'when multiple time slots across midnight in event timezone' do
        let(:event_sydney) { create(:event, time_zone: 'Australia/Sydney') }

        it 'correctly handles date boundaries' do
          # Create slots that cross midnight in Sydney but not in UTC
          # 11 PM and 11:30 PM Sydney time on Jan 15
          # Which is 12 PM and 12:30 PM UTC on Jan 15
          utc_time = Time.parse('2024-01-15 12:00:00 UTC')
          slot1 = create(:time_slot, event: event_sydney, start_time: utc_time, end_time: utc_time + 15.minutes)
          slot2 = create(:time_slot, event: event_sydney, start_time: utc_time + 30.minutes,
                                     end_time: utc_time + 45.minutes)

          # This would be after midnight in Sydney (1 AM on Jan 16)
          # But still Jan 15 in UTC (2 PM)
          slot3 = create(:time_slot,
                         event: event_sydney,
                         start_time: utc_time + 2.hours,
                         end_time: utc_time + 2.hours + 15.minutes)
          create(:availability, user: user, time_slot: slot1)
          create(:availability, user: user, time_slot: slot2)
          create(:availability, user: user, time_slot: slot3)
          get event_availabilities_path(event_url: event_sydney.url)
          json = response.parsed_body
          # Sydney is UTC+11 in January
          # 12:00 UTC = 23:00 Sydney (Jan 15)
          # 12:30 UTC = 23:30 Sydney (Jan 15)
          # 14:00 UTC = 01:00 Sydney (Jan 16)

          expect(json[:availability_data]).to have_key('Mon Jan 15 2024-23-0')
          expect(json[:availability_data]).to have_key('Mon Jan 15 2024-23-30')
          expect(json[:availability_data]).to have_key('Tue Jan 16 2024-1-0')
        end
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
        expect(json[:errors][:time_slot_ids]).to include('contains invalid time slot')
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
        expect(json[:errors][:participant_name]).to include 'is required'
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
        expect(json[:errors][:time_slot_ids]).to include('contains invalid time slot')
      end

      it 'clears all availabilities for anonymous user when empty array provided' do
        post event_availabilities_path(event_url: event.url),
             params: { time_slot_ids: [time_slot.id], participant_name: 'John' }
        anonymous_session_id = Availability.last.anonymous_session_id
        expect do
          post event_availabilities_path(event_url: event.url), params: { time_slot_ids: [], participant_name: 'John' }
        end.to change(Availability, :count).by(-1)
        expect(response).to have_http_status(:ok)
        expect(Availability.where(anonymous_session_id:).count).to eq(0)
      end
    end
  end
end
