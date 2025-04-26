require "pry"
require "rails_helper"

RSpec.describe "GET /registration", type: :request, inertia: true do
  context "renders signup page" do
    it "renders the sign up page" do
      get new_registration_path
      expect(response).to have_http_status(:ok)
      expect(inertia.component).to eq 'Auth/Signup'
    end
  end
end

RSpec.describe "RegistrationsController", type: :request, inertia: true do
  describe "GET /registration" do
    it "renders the sign up page" do
      get new_registration_path
      expect(response).to have_http_status(:ok)
      expect(inertia.component).to eq 'Auth/Signup'
    end
  end

  describe "POST /registration" do
    let(:valid_params) do
      { name: "Varun", email_address: "varun@example.com", password: "password" }
    end
    subject(:make_request) { post registration_path, params: params }

    context "with valid params" do
      let(:params) { valid_params }

      it "creates a user with valid params" do
        expect { make_request }.to change(User, :count).by(1)
        expect(response).to redirect_to(root_path) # Checks the status is 302 and the location in headers
        follow_redirect!
        expect(inertia.component).to eq "Event/New"
        expect(inertia.props[:flash][:success]).to eq("Signed up successfully!")
      end

      it "creates a guest user" do
        modified_params = valid_params.merge(email_address: nil, password: nil)
        expect { post registration_path, params: modified_params }.to change(User, :count).by(1)
        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(inertia.props[:flash][:success]).to eq("Signed up successfully!")
      end
    end

    context "with invalid params" do
      before { User.create!(valid_params) }
      let(:params) { valid_params }

      it("rejects duplicate email") do
        expect { make_request }.to change(User, :count).by(0)
        follow_redirect!
        expect(inertia.component).to eq "Auth/Signup"
        inertia_props = inertia.props.deep_symbolize_keys
        expect(inertia_props[:errors][:email_address][0]).to eq("has already been taken")
      end

      it("cannot create a user with invalid password") do
        modified_params = valid_params.merge(email: "john@example.com", password: "pass")
        expect { post registration_path, params: modified_params }.to change(User, :count).by(0)
        follow_redirect!
        expect(inertia.component).to eq("Auth/Signup")
        inertia_props = inertia.props.deep_symbolize_keys
        expect(inertia_props[:errors][:password][0]).to eq("is too short (minimum is 8 characters)")
      end
    end
    context "redirect authenticated users from sign up page" do
      it("redirect to root path") do
        post registration_path, params: valid_params
        follow_redirect!
        get new_registration_path
        expect(response).to redirect_to(root_path)
      end
    end
    context "rate limit registrations" do
      it "rate-limit after 10 tries" do
        7.times do |i|
          post registration_path, params: valid_params.merge(email_address: "user#{i}@example.com")
          delete session_path
        end
        post registration_path, params: valid_params.merge(email_address: "user11@example.com")
        follow_redirect!
        inertia_props = inertia.props.deep_symbolize_keys
        expect(inertia_props[:errors][:base][0]).to eq("Too many attempts. Please try again later.")
      end
    end
  end
end
