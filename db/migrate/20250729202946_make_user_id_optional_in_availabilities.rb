class MakeUserIdOptionalInAvailabilities < ActiveRecord::Migration[8.0]
  def change
    change_column_null :availabilities, :user_id, true

    remove_index :availabilities, %i[user_id time_slot_id],
                 name: 'index_user_and_time_slot_on_availability'
    add_index :availabilities, %i[user_id time_slot_id],
              unique: true, where: 'user_id IS NOT NULL',
              name: 'index_user_and_time_slot_on_availability'
    add_index :availabilities, %i[anonymous_session_id time_slot_id],
              unique: true,
              where: 'anonymous_session_id IS NOT NULL',
              name: 'index_anonymous_and_time_slot_on_availability'
  end
end
