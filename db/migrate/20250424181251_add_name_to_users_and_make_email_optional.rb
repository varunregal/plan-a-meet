class AddNameToUsersAndMakeEmailOptional < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :name, :string

    change_column_null :users, :email, true
    change_column_default :users, :email, from: "", to: nil
  end
end
