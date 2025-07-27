# Plan A Meet - Development Guide

## Project Overview

Plan A Meet is a modern event scheduling application built with Ruby on Rails 8 and React. The application helps users coordinate events by allowing participants to mark their availability across proposed time slots, making it easy to find optimal meeting times for groups.

## Current Architecture

The application uses Rails 8.0.1 with PostgreSQL for the backend, React 19 with TypeScript and Inertia.js for the frontend, and Tailwind CSS with shadcn/ui components for styling. The email system is powered by Resend for reliable delivery, and SolidQueue handles background job processing.

### Time Slot Architecture
- Time slots are now 15-minute intervals (changed from 30 minutes)
- Events automatically generate unique 8-character URL tokens using a custom callback
- All times are stored in UTC in the database
- Frontend handles timezone conversion based on user selection

### Multi Time Range Support (TODO)
Currently, events use a single time range for all dates (e.g., 9 AM - 5 PM for all selected days). We need to support different time ranges per day:
- Monday: 9 AM - 5 PM
- Tuesday: 10 AM - 3 PM
- Wednesday: 2 PM - 6 PM

**Implementation Options:**
1. **Per-Day UI**: Show separate start/end time inputs for each selected date
2. **Progressive Enhancement**: Start with single range, add "Customize per day" option
3. **Time Templates**: Offer presets like "Weekdays 9-5", "Mornings only", "Custom"

This enhancement should be implemented after the core availability marking feature is complete.

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

## Anonymous User Architecture

### Overview
Plan A Meet follows a "Zero friction entry, progressive engagement" philosophy. Users can create events and mark availability without creating an account. Authentication is only required when users want advanced features like event management, notifications, or cross-device access.

### Identity Management System

#### Identity Levels
1. **Anonymous (Level 0)**
   - Identified by browser cookie (ephemeral_id)
   - Can create events and mark availability
   - Data persists for 30 days of inactivity
   - All actions tied to browser session

2. **Identified (Level 1)**
   - User provides email (no password required)
   - Can receive notifications
   - Data linked to email address
   - Can access their events via email links

3. **Authenticated (Level 2)**
   - Full account with password
   - Cross-device access
   - Event management dashboard
   - Calendar integrations

#### Technical Implementation

**Browser-Based Tracking**
- Every visitor receives a unique ephemeral_id (UUID) stored in a secure HttpOnly cookie
- This ID links all their anonymous actions (creating events, marking availability)
- Cookie persists for 30 days, refreshed on each visit

**Database Schema Additions**
```
events table:
- creator_email (for anonymous creators)
- ephemeral_id (links to browser session)

availabilities table:
- participant_email (for anonymous participants)
- participant_name (for display purposes)
- ephemeral_id (links to browser session)

ephemeral_sessions table:
- id (UUID)
- last_seen_at
- created_at
- session_data (JSON)
```

**Session Flow Example**
1. User visits site → Generate ephemeral_id → Store in cookie
2. User creates event → Link event to ephemeral_id
3. User marks availability → Link availability to ephemeral_id
4. User provides email → Link email to all data with that ephemeral_id
5. User creates account → Migrate all email-linked data to user account

### Progressive Engagement Strategy

#### Engagement Triggers
- **Stay Anonymous**: Create event, mark availability, view event
- **Provide Email**: Get notifications, access event via email, download calendar file
- **Create Account**: Manage multiple events, view analytics, integrate calendar

#### Value Propositions at Each Level
1. **Anonymous**: "Schedule in seconds, no sign-up required"
2. **Email**: "Never miss an update about your events"
3. **Account**: "Your personal scheduling assistant"

### Implementation Phases

#### Phase 1: Anonymous Event Creation (Current)
- ✅ Already implemented
- Events can be created without authentication

#### Phase 2: Anonymous Availability Marking (Next)
- Add ephemeral_id system
- Update Availability model to support anonymous users
- Create UI for name/email collection when marking availability

#### Phase 3: Identity Resolution
- Build email claiming system
- Create migration logic for anonymous → identified data
- Implement "claim your events" email flow

#### Phase 4: Progressive Features
- Add features that encourage (but don't require) authentication
- Calendar sync, recurring events, team scheduling
- Analytics and insights

### Key Principles

1. **Never Block Core Functionality**
   - Creating events and marking availability must always work without login
   - Authentication is only for enhanced features

2. **Transparent Data Handling**
   - Clear communication about what happens to anonymous data
   - Easy data export/deletion for GDPR compliance

3. **Smooth Upgrade Path**
   - Converting from anonymous → account should be one click
   - Never lose user data during conversion
   - Email-based account creation (no password initially)

### Cookie Strategy for Anonymous Users

#### Implementation Approach
We use a simple cookie-based system to remember anonymous users within the same browser:

1. **No cookie on first visit** - Don't set cookies until user takes an action
2. **Set cookie on interaction** - When user creates event or marks availability
3. **Cookie contents**:
   ```ruby
   cookies.encrypted[:guest_session] = {
     value: {
       id: SecureRandom.uuid,
       name: "User's Name",
       created_at: Time.current
     }.to_json,
     expires: 30.days.from_now,
     httponly: true,
     secure: Rails.env.production?
   }
   ```

#### Handling Shared Browsers
For browsers used by multiple people (family computer, work computer):

1. **Pre-fill name from cookie** when returning user visits
2. **Show "Not [Name]?" link** prominently on all forms
3. **Clear and reset** when user indicates they're someone else
4. **Simple UX**: "Welcome back, John! Not John? Click here"

This approach works for 95% of users (personal devices) while providing easy switching for shared browser scenarios.

#### Privacy Considerations
- Cookies expire after 30 days of inactivity
- Only store minimal data (ID and name)
- Clear indication of what's stored
- Easy cookie clearing option

### Architecture Flexibility

This architecture is designed to be flexible and can be modified based on user feedback and technical requirements. Key areas for potential iteration:

1. **Storage Duration**: 30-day default for anonymous data can be adjusted
2. **Identity Resolution**: Can add more sophisticated device fingerprinting if needed
3. **Feature Gates**: Which features require which identity level can be tweaked
4. **Migration Strategy**: The anonymous → authenticated flow can be optimized based on user behavior
5. **Cookie Strategy**: Can evolve from simple name storage to more sophisticated tracking

The architecture prioritizes user experience while maintaining data integrity and providing a clear path to user engagement. We can iterate on any component as we learn more about user behavior.

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

### Rails Architecture Best Practices
- **Prefer Models and Controllers**: Keep business logic in models and controllers following Rails conventions
- **Use Services Sparingly**: Only create service objects when the logic is complex and doesn't fit naturally in models or controllers
- **Error Handling**: Use Rails standard error handling patterns:
  - Model validations for data integrity
  - Controller rescue_from for handling exceptions
  - Return meaningful error messages to users
  - Use Rails' built-in error responses (422 for validation errors, 404 for not found, etc.)
- **Fat Models, Skinny Controllers**: Business logic belongs in models, controllers should orchestrate
- **Avoid Premature Abstraction**: Start with simple Rails patterns, extract to services only when necessary

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

### Anonymous User Implementation Approach
We're implementing anonymous user functionality carefully to integrate with Rails 8's existing authentication system:

1. **Analysis Phase**: 
   - Understand existing Rails 8 authentication (Sessions, Users, Authentication concern)
   - Note: Previously attempted guest user approach was removed (is_guest column)
   - Current system uses session-based authentication with permanent signed cookies

2. **Planning Phase**:
   - Design anonymous session tracking that complements existing authentication
   - Ensure anonymous users can seamlessly convert to authenticated users
   - Maintain data integrity during the conversion process

3. **Implementation Strategy**:
   - Use signed cookies for anonymous session IDs (consistent with current auth)
   - Add anonymous_session_id to events and availabilities tables
   - Create methods to convert anonymous data when user signs up
   - Ensure all existing tests continue to pass

4. **Testing Strategy**:
   - Review and update existing authentication tests
   - Add comprehensive tests for anonymous functionality
   - Test the conversion flow from anonymous to authenticated
   - Ensure no regression in existing features

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