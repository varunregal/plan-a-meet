# require 'rails_helper'

# require 'pry'
# RSpec.describe 'ApplicationController', type: :request do
#   describe 'anonymous session tracking' do
#     it 'generates an anonymous session on first visit' do
#       get root_path
#       jar = ActionDispatch::Cookies::CookieJar.build(request, cookies.to_hash)
#       expect(jar.signed['anonymous_session_id']).to be_present
#     end

#     it 'does not set anonymous session for authenticated users' do
#       user = create(:user)
#       sign_in_as(user)
#       follow_redirect!

#       jar = ActionDispatch::Cookies::CookieJar.build(request, cookies.to_hash)
#       expect(jar.signed[:anonymous_session_id]).to be_nil
#     end
#   end
# end
