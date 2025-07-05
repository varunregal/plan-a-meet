class CreateInvitations < ActiveRecord::Migration[8.0]
  def change
    create_table :invitations do |t|
      t.references :event, null: false, foreign_key: true
      t.references :inviter, null: false, foreign_key: { to_table: :users }
      t.references :invitee, null: true, foreign_key: { to_table: :users }
      t.string :email_address, null: false
      t.string :status, default: 'pending', null: false
      t.string :invitation_token, null: false
      t.datetime :sent_at

      t.timestamps
    end
    add_index :invitations, %i[event_id email_address], unique: true
    add_index :invitations, :invitation_token, unique: true
  end
end
