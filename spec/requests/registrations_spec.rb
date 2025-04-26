require "pry"
require "rails_helper"

RSpec.describe "Registrations", type: :request, inertia: true do
  describe "GET /regsitration" do
    it "renders the sign up page" do
      get new_registration_path
      expect(response).to have_http_status(:ok)
      expect(inertia.component).to eq 'Auth/Signup'
    end
  end

  describe "POST /registrations valid params" do
    let(:valid_params) do
      {
        name: "Varun",
        email_address: "varun@example.com",
        password: "password"
      }
    end

    it "creates a user with valid params" do
      expect {
        post registration_path, params: valid_params
      }.to change(User, :count).by(1)
      expect(response).to redirect_to(root_path) # Checks the status is 302 and the location in headers
      follow_redirect!
      expect(inertia.component).to eq "Event/New"
      expect(inertia.props[:flash][:success]).to eq("Signed up successfully!")
    end

    it "creates a guest user" do
      guest_params = valid_params.merge(email_address: nil, password: nil)
      expect {
        post registration_path, params: guest_params
      }.to change(User, :count).by(1)
      expect(response).to redirect_to(root_path)
      follow_redirect!
      expect(inertia.props[:flash][:success]).to eq("Signed up successfully!")
    end
  end

  describe "POST /registrations invalid params" do
    let(:valid_params) do
      {
        name: "Varun",
        email_address: "varun@example.com",
        password: "password"
      }
    end
    before :each do
       User.create(valid_params)
    end
    it("cannot create a new user with duplicate email") do
      expect {
        post registration_path, params: valid_params
      }.to change(User, :count).by(0)
      follow_redirect!
      expect(inertia.component).to eq "Auth/Signup"
      expect(inertia.props[:errors]["email_address"][0]).to eq("has already been taken")
    end

    it("cannot create a user with invalid password") do
      modified_params = valid_params.merge(email: "john@example.com", password: "pass")
      expect {
        post registration_path, params: modified_params
      }.to change(User, :count).by(0)
      follow_redirect!
      expect(inertia.component).to eq("Auth/Signup")
      expect(inertia.props[:errors]["password"][0]).to eq("is too short (minimum is 8 characters)")
    end
  end
end
