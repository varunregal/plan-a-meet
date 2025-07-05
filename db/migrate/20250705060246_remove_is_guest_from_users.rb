class RemoveIsGuestFromUsers < ActiveRecord::Migration[8.0]
  def change
    remove_column :users, :is_guest, :boolean
  end
end
