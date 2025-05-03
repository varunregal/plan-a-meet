Rails.application.routes.draw do
  resource :session, only: [ :new, :create, :destroy ]
  resource :registration, only: [ :new, :create ]
  resources :passwords, param: :token
  get "inertia-example", to: "inertia_example#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  resources :events, param: :url do
    resources :availabilities, only: [ :index ]
    resources :scheduled_slots, only: [ :index, :create, :destroy ]
    member do
      patch :schedule
      get :schedule
      patch :cancel
      patch :reschedule
      get :confirmation
    end
  end

  resources :time_slots, only: [] do
    resource :availability, only: [ :create, :destroy ]
  end
  root "events#new"
end
