Rails.application.routes.draw do
  resource :session, only: %i[create destroy]
  resource :registration, only: %i[create]
  resources :passwords, param: :token
  get 'inertia-example', to: 'inertia_example#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  resources :events, param: :url do
    resources :availabilities, only: %i[index create]
    resources :scheduled_slots, only: %i[index create destroy]
    member do
      patch :schedule
      get :schedule
      patch :cancel
      patch :reschedule
      get :confirmation
    end
    resources :invitations, param: :token do
      member do
        get :verify
      end
    end
  end
  resource :profile, only: [:show]

  root 'events#new'
end
