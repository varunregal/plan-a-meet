class CreateAvailabilities < ActiveRecord::Migration[8.0]
  def change
    create_table :availabilities do |t|
      t.references :user, null: false, foreign_key: true
      t.references :time_slot, null: false, foreign_key: true

      t.timestamps
    end
    add_index :availabilities, %i[user_id time_slot_id], unique: true,
                                                         name: 'index_user_and_time_slot_on_availability'
  end
end
