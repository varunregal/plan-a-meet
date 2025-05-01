class DropUserAvailabilities < ActiveRecord::Migration[8.0]
  def up
    drop_table :user_availabilities, if_exists: true
  end

  def down
    create_table :user_availabilities do |t|
      t.references :user, null: false, foreign_key: true
      t.references :event, null: false, foreign_key: true
      t.references :time_slot, null: true, foreign_key: true

      t.timestamps
    end
  end
end
