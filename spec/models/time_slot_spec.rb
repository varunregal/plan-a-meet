require 'rails_helper'
require 'pry'
RSpec.describe TimeSlot, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:event) }
    it { is_expected.to have_many(:availabilities).dependent(:destroy) }
    it { is_expected.to have_many(:users).through(:availabilities) }
    it { is_expected.to have_many(:scheduled_slots).dependent(:destroy) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:start_time) }
    it { is_expected.to validate_presence_of(:end_time) }

    context 'with start_time and end_time validation' do
      let(:event) { create(:event) }

      it 'is valid when start_time is before end_time' do
        time_slot = event.time_slots.build(
          start_time: Time.current,
          end_time: 15.minutes.from_now
        )
        expect(time_slot).to be_valid
      end

      it 'is invalid when start_time equals end_time' do
        freeze_time do
          start_time = Time.current
          end_time = Time.current

          time_slot = event.time_slots.build(
            start_time:,
            end_time:
          )
          expect(time_slot).not_to be_valid
          expect(time_slot.errors[:start_time]).to include('must be before end time')
        end
      end

      it 'is invalid when start_time is after end_time' do
        time = Time.current
        time_slot = event.time_slots.build(
          start_time: time + 1.hour,
          end_time: time
        )
        expect(time_slot).not_to be_valid
        expect(time_slot.errors[:start_time]).to include('must be before end time')
      end
    end
  end

  describe 'factory' do
    it 'has a valid factory' do
      time_slot = build(:time_slot)
      expect(time_slot).to be_valid
    end
  end

  describe 'time slot duration' do
    let(:time_slot) { create(:time_slot) }

    it 'has the correct duration' do
      duration = (time_slot.end_time - time_slot.start_time) / 60
      expect(duration).to eq(15.0)
    end
  end
end
