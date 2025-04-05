class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :password_digest
      t.references :event, null: false, foreign_key: true

      t.timestamps
    end
    add_index :users, [ :name, :event_id ], unique: true
  end
end
