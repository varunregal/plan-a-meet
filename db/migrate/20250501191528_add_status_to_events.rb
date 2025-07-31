class AddStatusToEvents < ActiveRecord::Migration[8.0]
  def change
    add_column :events, :status, :string, null: false, default: 'created'
  end
end
