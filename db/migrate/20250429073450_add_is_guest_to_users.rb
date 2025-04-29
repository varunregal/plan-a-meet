class AddIsGuestToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :is_guest, :boolean, null: false, default: false
  end
end
