class AddPartialUniqueIndexOnUsersEmail < ActiveRecord::Migration[8.0]
  def change
    remove_index :users, :email_address if index_exists?(:users, :email_address)

    add_index :users, :email_address, unique: true, where: 'email_address IS NOT NULL',
                                      name: 'index_users_on_email_address_not_null'
  end
end
