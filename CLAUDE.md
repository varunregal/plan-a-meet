# Plan A Meet - Development Guide

## Project Overview

Plan A Meet is a modern event scheduling application built with Ruby on Rails 8 and React. The application helps users coordinate events by allowing participants to mark their availability across proposed time slots, making it easy to find optimal meeting times for groups.

## Current Architecture

The application uses Rails 8.0.1 with PostgreSQL for the backend, React 19 with TypeScript and Inertia.js for the frontend, and Tailwind CSS with shadcn/ui components for styling. The email system is powered by Resend for reliable delivery, and SolidQueue handles background job processing.

## Completed Features

### Authentication & User Management
- Custom user registration and login system using Rails 8's built-in authentication
- Password reset functionality with time-limited tokens and professional email templates
- Rate limiting for security (10 registration attempts per 3 minutes)
- Session management with proper security practices

### Email System
- Complete email infrastructure setup with Resend integration
- Welcome emails for new user registrations with modern, branded templates
- Password reset emails matching the application's design system
- Email templates using the brand color (#6e56cf) with shadcn-inspired spacing and typography

### Event Management
- Event creation with name, dates, and time slots
- Event sharing via unique URLs
- User availability tracking across time slots
- Event creator assignment and management
- **Invitation System**
  - Invitation model with email validation and status tracking (completed)
  - InvitationsController with proper authorization (completed)
  - Frontend dialog for sending invitations with Inertia form handling (completed)
  - Validation and error handling for email addresses (completed)
  - Display of existing invitations with status indicators (completed)
  - InvitationMailer sending emails when invitations are created (completed)
  - Consistent email templates matching app design system (completed)

### Code Quality & Testing
- Comprehensive test coverage for registrations and core functionality
- Fixed factory patterns to match actual model structures
- RSpec test suite with proper configuration
- Consistent code formatting with automated tools
- TDD approach for invitation feature with request specs

## Phase One Roadmap

### Invitation Acceptance/Decline Flow (TODO)
**Next Steps:**
- Create route for accepting/declining invitations via token
- Implement controller action to handle invitation responses
- Create view for invitation acceptance page
- Handle guest user registration if invitee doesn't have an account
- Update invitation status when accepted/declined
- Redirect to event page after acceptance
- Add tests for the acceptance flow

### Real-time Notifications
We'll implement both in-app and email notifications for availability updates. When participants mark their availability, the event creator will receive notifications. This ensures everyone stays informed about participation changes throughout the scheduling process.

### Event Finalization & Communication
Once the event creator schedules the final event time, all participants will receive confirmation notifications both in-app and via email. This completes the scheduling workflow and ensures everyone knows the final details.

## Phase Two Possibilities

### AI Integration Opportunities
Future AI enhancements could include calendar integration with Google Calendar and Outlook to automatically suggest available times based on participants' existing schedules. We could also implement intelligent scheduling suggestions that consider factors like time zone optimization, participant preferences, and historical scheduling patterns.

### Advanced Features
- Smart scheduling recommendations based on participant availability patterns
- Integration with external calendar systems for automated conflict detection
- Meeting preparation assistance with agenda suggestions
- Follow-up task management and meeting outcome tracking

## Development Guidelines

### Email Templates
All email templates follow the established design system:
- Primary brand color #6e56cf for buttons and accents
- Clean, minimalist design matching shadcn components
- Consistent spacing: 32px/24px padding, 16px for cards
- Gray background wrapper (#f3f4f6) for consistent display in all email clients
- Button styling: 10px 16px padding, 6px border-radius
- Font sizes: 24px for headers, 14px for body text, 12px for small text
- Mobile-responsive and tested across major email clients

### Testing Strategy
Every new feature should include comprehensive test coverage including unit tests, integration tests, and email functionality verification. The test suite uses RSpec with proper factory patterns that match actual model structures.

### Code Style
The codebase follows Rails conventions with Tailwind CSS for styling. Email templates use inline styles for maximum compatibility. All code should be formatted consistently using automated tools, and error handling should be specific rather than generic.

## Development Principles

### Code Generation and Development Approach
- Don't generate more than 20 lines of code at a time
- Always use Test-Driven Development (TDD) approach for Rails
- Explain the problem and approach before generating code
- Proceed with problem-solving in a step-by-step approach

### Testing Best Practices
- Always check for existing factories before writing manual test setup
- Use FactoryBot factories for all model associations in tests
- Follow DRY principles - don't recreate what already exists
- Investigate existing test patterns and infrastructure before writing new tests

## Running the Application

### Development Setup
- Start the Rails server with `rails server`
- Start the SolidQueue worker with `bundle exec solid_queue` or `bin/jobs`
- Run tests with `rspec`
- Check email delivery by examining the development logs or testing with actual email addresses

### Email Configuration
- Development uses Resend SMTP with API keys stored in Rails credentials
- Email delivery is enabled in development for testing
- All email templates are tested and verified to work across different email clients

## Claude Code Guidelines

### Development Principles
- Never write content to the files unless explicitly requested

This guide should be updated as new features are implemented and architectural decisions are made.