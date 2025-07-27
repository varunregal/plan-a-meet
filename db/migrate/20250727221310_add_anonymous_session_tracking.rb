class AddAnonymousSessionTracking < ActiveRecord::Migration[8.0]
  def change
    change_table :events, bulk: true do |t|
      t.string :anonymous_session_id
      t.index :anonymous_session_id
    end

    change_table :availabilities, bulk: true do |t|
      t.string :anonymous_session_id
      t.string :participant_name
      t.index :anonymous_session_id
    end
  end
end
