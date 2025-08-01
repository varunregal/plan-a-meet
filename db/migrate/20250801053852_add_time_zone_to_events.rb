class AddTimeZoneToEvents < ActiveRecord::Migration[8.0]
  def change
    add_column :events, :time_zone, :string, default: 'UTC'
  end
end
