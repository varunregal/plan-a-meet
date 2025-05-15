# Plan A Meet

A modern event scheduling application that helps users coordinate and schedule events based on group availability. Built with Ruby on Rails 8, React, and TypeScript, Plan A Meet provides a seamless user experience for managing event schedules and participant availability.

## 🚀 Tech Stack

### Backend

- Ruby on Rails 8.0.1
- PostgreSQL 17
- Solid Queue for background jobs
- Solid Cache for caching
- RSpec for testing

### Frontend

- React 19
- TypeScript
- Inertia.js for Rails-React integration
- Tailwind CSS for styling
- shadcn/ui components
- Vite for asset bundling

### Infrastructure

- Docker for containerization
- Kamal for deployment
- GitHub Actions for CI/CD

## 🛠️ Prerequisites

- Ruby 3.3.3
- Node.js 20.12.1
- PostgreSQL 17
- Docker (optional, for containerized development)

## 🏗️ Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd plan-a-meet
   ```

2. Install dependencies:

   ```bash
   bundle install
   yarn install
   ```

3. Set up the database:

   ```bash
   bin/rails db:prepare
   ```

4. Start the development server:
   ```bash
   bin/dev
   ```

This will start:

- Rails server
- Vite dev server
- Tailwind CSS watcher

## 🧪 Testing

Run the test suite with:

```bash
bin/rspec
```

## 🚢 Deployment

The application is configured for deployment using Kamal. The deployment configuration can be found in `config/deploy.yml`.

Key deployment features:

- SSL auto-certification via Let's Encrypt
- PostgreSQL as an accessory service
- Docker-based deployment
- Environment variable management
- Asset fingerprinting and bridging

## 🔧 Development

### Code Style

- Ruby code follows Rails style guide
- TypeScript/React code uses strict mode
- ESLint and RuboCop for code linting

### Available Scripts

- `bin/dev` - Start development server
- `bin/rails test` - Run Rails tests
- `bin/rspec` - Run RSpec tests
- `bin/rubocop` - Run RuboCop
- `bin/brakeman` - Run security checks

## 📦 Environment Variables

Required environment variables:

- `RAILS_MASTER_KEY`
- `POSTGRES_PASSWORD`
- `KAMAL_REGISTRY_PASSWORD`

## 🔐 Security

- Brakeman for security scanning
- Regular dependency audits
- Secure password handling
- SSL/TLS encryption

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
