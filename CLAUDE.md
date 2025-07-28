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
Plan A Meet allows users to create events and mark availability without creating an account. This "zero friction" approach maximizes participation while offering clear benefits for those who choose to sign up.

### Implementation Strategy

#### Cookie-Based Sessions
We use signed cookies to track anonymous users without polluting the database with temporary user records:

```ruby
# Set only when users take actions (create event, mark availability)
cookies.signed[:anonymous_session_id] = {
  value: SecureRandom.hex(16),
  expires: 30.days.from_now,
  httponly: true,
  same_site: :lax
}
```

#### Database Schema
```ruby
# Migration for anonymous user tracking
class AddAnonymousSessionTracking < ActiveRecord::Migration[8.0]
  def change
    # Track anonymous event creators
    add_column :events, :anonymous_session_id, :string
    add_index :events, :anonymous_session_id
    
    # Track anonymous availability markers  
    add_column :availabilities, :anonymous_session_id, :string
    add_column :availabilities, :participant_name, :string
    add_index :availabilities, :anonymous_session_id
  end
end
```

#### Controller Implementation

##### EventsController
```ruby
def create
  anonymous_session_id = ensure_anonymous_session_value
  event = build_event_with_session(anonymous_session_id)
  ActiveRecord::Base.transaction do
    event.save!
    create_time_slots(event)
  end
  store_anonymous_session_cookie(anonymous_session_id) if anonymous_session_id
  redirect_to event_path(event)
end

def show
  event = Event.find_by!(url: params[:url])
  is_creator = if authenticated?
    event.event_creator_id == Current.user&.id
  else
    event.anonymous_session_id.present? && 
    event.anonymous_session_id == cookies.signed[:anonymous_session_id]
  end
  
  render inertia: 'Event/Show',
         props: { 
           id: event.id, 
           name: event.name,
           time_slots: event.time_slots.as_json(only: %i[id start_time end_time]),
           is_creator: is_creator
         }
end

private

def ensure_anonymous_session_value
  return nil if authenticated?
  cookies.signed[:anonymous_session_id] || SecureRandom.hex(16)
end

def build_event_with_session(anonymous_session_id)
  Event.new(event_params).tap do |event|
    if authenticated?
      event.event_creator = Current.user
    else
      event.anonymous_session_id = anonymous_session_id
    end
  end
end

def store_anonymous_session_cookie(value)
  cookies.signed[:anonymous_session_id] ||= {
    value: value,
    expires: 30.days.from_now,
    httponly: true,
    same_site: :lax
  }
end
```

### Conversion Flow

When anonymous users sign up or sign in, we convert their data:

```ruby
# In RegistrationsController/SessionsController
def convert_anonymous_to_authenticated(user)
  anonymous_session_id = cookies.signed[:anonymous_session_id]
  return unless anonymous_session_id
  
  # Convert events
  Event.where(anonymous_session_id: anonymous_session_id)
       .update_all(
         event_creator_id: user.id,
         anonymous_session_id: nil
       )
  
  # Convert availabilities
  Availability.where(anonymous_session_id: anonymous_session_id)
              .update_all(
                 user_id: user.id,
                 anonymous_session_id: nil
               )
  
  # Clear the anonymous session
  cookies.delete(:anonymous_session_id)
end
```

### Feature Access Levels

#### Anonymous Users Can:
- Create events
- Share event links
- Mark availability (with required name)
- View basic availability grid

#### Sign Up to Unlock:
- Email notifications when people respond
- See full participant names (not just "John S.")
- Manage multiple events from dashboard
- Access events from any device
- Advanced analytics and insights

### Shared Device Support

For computers used by multiple people, we provide a "Not you?" option:

```ruby
# When showing existing availability
if @existing_availability
  # Show: "Marking as: John Smith [Not you?]"
  # Clicking "Not you?" clears session and starts fresh
end

# Controller action
def reset_anonymous_session
  cookies.delete(:anonymous_session_id)
  redirect_back(fallback_location: event_path(params[:event_url]))
end
```

### Progressive Engagement UI

```ruby
# On event creation (anonymous)
"Event created! Share this link: ..."
"Sign up to get notified when people respond"

# When someone marks availability (for anonymous creator)
"3 people have responded to your event"
"Sign up to see who and get instant notifications"

# Clear value propositions
"Why sign up?"
"✓ Email notifications"
"✓ See who responded" 
"✓ Manage all your events"
"✓ Never lose access"
```

### Key Design Decisions

1. **Cookie-only approach** - No database pollution with temporary users
2. **30-day expiration** - Balances convenience with cleanup
3. **Required names** - Anonymous doesn't mean "Unknown Person"
4. **Progressive disclosure** - Only ask for info when providing clear value
5. **Shared device support** - "Not you?" for multi-user browsers

## Current Implementation Status

### Completed ✅
1. **Database Schema** - Added `anonymous_session_id` to events and availabilities tables
2. **Anonymous Event Creation** - Anonymous users can create events with session tracking
3. **Creator Identification** - Show page identifies if viewer is the event creator
4. **Cookie Management** - Only sets cookies when users take actions (not just viewing)
5. **Test Coverage** - Comprehensive tests for all anonymous user scenarios

### In Progress 🚧
1. **Conversion Flow** - Converting anonymous data when users sign up/sign in
2. **Cleanup Old Code** - Removing obsolete session-based event assignment methods

### Next Steps 📋
1. **Implement Conversion in Authentication**
   - Add `convert_anonymous_to_authenticated` to RegistrationsController
   - Add same conversion to SessionsController
   - Remove old `assign_pending_event_creator` and related methods
   
2. **Anonymous Availability Marking**
   - Create UI for anonymous users to mark availability
   - Require name input for anonymous users
   - Implement "Not you?" functionality for shared devices
   
3. **Availability Grid Display**
   - Show who's available for each time slot
   - Display names (full for authenticated, partial for anonymous)
   - Highlight current user's selections
   
4. **Progressive Engagement UI**
   - Add prompts to sign up for notifications
   - Show benefits of creating an account
   - Implement smooth upgrade flow

### Technical Debt to Address
- Remove `Events::Create` service file (low priority)
- Clean up old session-based event tracking code
- Fix typos in test descriptions ("vbiew" → "view")

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