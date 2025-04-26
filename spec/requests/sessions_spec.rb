require "pry"
require "rails_helper"

RSpec.describe "SessionsController", type: :request, inertia: true do
  describe "GET /session" do
    it "renders sign in page" do
      get new_session_path
      expect(response).to have_http_status(:ok)
      expect(inertia.component).to eq 'Auth/Login'
    end
  end

  describe "POST /session" do
    let(:valid_params) do
      { email_address: "varun@example.com", password: "password" }
    end
    before { User.create!(valid_params.merge(name: "Varun")) }

    context "with valid params" do
      it("creates a user with valid params") do
        post session_path, params: valid_params
        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(inertia.props[:flash][:success]).to eq("Signed in successfully!")
        expect(inertia.component).to eq("Event/New")
      end
    end

    context "with invalid params" do
      it("rejects a new email") do
        modified_params = valid_params.merge(email_address: "john@example.com")
        post session_path, params: modified_params
        follow_redirect!
        expect(inertia.component).to eq("Auth/Login")
        inertia_props = inertia.props.deep_symbolize_keys
        expect(inertia_props[:errors][:base][0]).to eq("Invalid email or password")
      end
    end
    context "redirect authenticated users from sign in page" do
      it("redirect to root path") do
        post session_path, params: valid_params
        follow_redirect!
        get new_session_path
        expect(response).to redirect_to(root_path)
      end
    end
    context "rate limit registrations" do
      it "rate-limit after 10 tries" do
        7.times do |i|
          User.create!(valid_params.merge(email_address: "user#{i}@example.com", name: "user"))
          post session_path, params: valid_params.merge(email_address: "user#{i}@example.com")
          delete session_path
        end
        User.create!(valid_params.merge(email_address: "user11@example.com", name: "user"))
        post session_path, params: valid_params.merge(email_address: "user11@example.com")
        follow_redirect!
        inertia_props = inertia.props.deep_symbolize_keys
        expect(inertia_props[:errors][:base][0]).to eq("Too many attempts. Please try again later.")
      end
    end
  end
end
