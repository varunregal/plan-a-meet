class CreateTimeSlots < ActiveRecord::Migration[8.0]
  def change
    create_table :time_slots do |t|
      t.datetime :start_time, null: false
      t.datetime :end_time, null: false
      t.references :event, null: false, foreign_key: true, index:true

      t.timestamps
    end
  end
end
