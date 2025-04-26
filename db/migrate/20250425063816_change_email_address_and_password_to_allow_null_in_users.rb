class ChangeEmailAddressAndPasswordToAllowNullInUsers < ActiveRecord::Migration[8.0]
  def change
    change_column_null :users, :email_address, true
    change_column_null :users, :password_digest, true
    change_column_null :users, :name, false
  end
end
