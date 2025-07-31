class CreateScheduledSlots < ActiveRecord::Migration[8.0]
  def change
    create_table :scheduled_slots do |t|
      t.references :event, null: false, foreign_key: true
      t.references :time_slot, null: false, foreign_key: true

      t.timestamps
    end
    add_index :scheduled_slots, %i[event_id time_slot_id], unique: true,
                                                           name: 'index_scheduled_slot_on_event_and_time_slot'
  end
end
