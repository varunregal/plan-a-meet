require 'rails_helper'

RSpec.describe 'Invitations', :inertia, type: :request do
  let(:user) { create(:user) }
  let(:event) { create(:event, event_creator: user) }
  let(:other_creator) { create(:user) }
  let(:other_event) { create(:event, event_creator: other_creator) }

  before { sign_in_as(user) }

  describe 'POST /events/:url/invitations' do
    let(:valid_params) do
      {
        invitation: {
          email_addresses: ['test1@example.com', 'test2@example.com']
        }
      }
    end

    context 'when user is event creator' do
      it 'creates invitations for provided emails' do
        expect do
          post event_invitations_path(event), params: valid_params
        end.to change(Invitation, :count).by(2)
      end
    end
  end
end
