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

### Frontend Architecture Refactoring (Completed)
- **Component-Based Architecture**: Refactored large components into smaller, focused components
- **React Context for State Management**: Implemented GridContext for shared grid state
- **Custom Hooks**: Created reusable hooks for business logic:
  - `useGridData`: Processes and structures time slot data
  - `useDragSelection`: Handles drag-and-drop slot selection
  - `useAvailabilitySelection`: Manages availability selection state
- **Utility Functions**: Extracted date formatting and availability helpers
- **TypeScript Types**: Added proper type definitions for better type safety
- **Performance Optimizations**: Used React.memo for preventing unnecessary re-renders
- **Time Slot Display**: Fixed date ordering to show in ascending order (earliest first)

### Availability Marking System (Completed)
- **Backend API Implementation**:
  - RESTful endpoints at `/events/:url/availabilities` for bulk save/replace
  - Support for both authenticated and anonymous users
  - Anonymous users tracked via signed cookies with 30-day expiration
  - Proper validation and error handling with field-specific errors
  - Comprehensive test coverage for all scenarios
- **Database Architecture**:
  - Made `user_id` optional in availabilities table
  - Added conditional unique indexes for authenticated/anonymous users
  - Support for `participant_name` for anonymous users
- **Controller Design**:
  - Clean, refactored controller with single responsibility methods
  - Transaction-wrapped operations for data integrity
  - Proper error responses in consistent format
- **Frontend Save Functionality**:
  - Created axios API wrapper with CSRF token support
  - Implemented save button with unsaved changes tracking
  - Added loading states and toast notifications
  - Fixed initialization bug (changed `> 1` to `> 0` for loading saved selections)

### Timezone Support (Completed)
- **Database Changes**:
  - Added `time_zone` column to events table via migration
  - Events now store the timezone selected during creation
- **Backend Implementation**:
  - Event model validates and stores timezone
  - Time slots created in the event's timezone but stored as UTC
  - Availability keys generated using event's timezone for consistency
- **Frontend Components**:
  - Created `TimezoneSelect` component with comprehensive timezone list
  - Integrated timezone selection in event creation form
  - Auto-detects user's timezone as default

### Code Quality & Testing
- Comprehensive test coverage for registrations and core functionality
- Fixed factory patterns to match actual model structures
- RSpec test suite with proper configuration
- Consistent code formatting with automated tools
- TDD approach for invitation feature with request specs

## Phase One Roadmap

### Frontend Availability Integration (COMPLETED)
**Completed:**
- Added unsaved changes tracking with visual indicator
- Implemented save functionality using axios API with CSRF token
- Added loading states during save operation
- Integrated toast notifications for success/error feedback
- Load and display current user's saved selections on page load
- Fixed initialization bug for single saved slot (changed `> 1` to `> 0`)
- Created sidebar component with anonymous user name input
- Moved save functionality to dedicated sidebar for cleaner UI
- Implemented cookie-based name persistence for anonymous users
- Added name validation with error states
- Made sidebar sticky for better UX

### State Management Architecture (COMPLETED)
**Zustand Implementation:**
- Implemented Zustand for centralized state management
- Created `eventStore` with the following state:
  - `totalParticipants`: Number of people who have responded
  - `selectedSlots`: Currently selected time slots
  - `hasUnsavedChanges`: Automatically calculated by comparing current selection with saved slots
  - `currentUserSlots`: Slots saved in the backend
- Removed prop drilling for shared state
- Maintained hybrid approach: Zustand for app-wide state, Context for component-specific state

**Component Refactoring:**
- `Event/Show.tsx`: Simplified to only pass essential props
- `CalendarImportSection`: Gets actions from Zustand, passes only display data
- `AvailabilityGrid`: Uses Zustand for selected slots, Context for grid utilities
- `TimeSlot`: Gets totalParticipants directly from Zustand
- `AvailabilitySidebar`: Gets hasUnsavedChanges from Zustand

### UI/UX Improvements (COMPLETED)
**Professional Heatmap Design:**
- Implemented percentage-based display (0%, 25%, 50%, 75%, 100%)
- Progressive green color scheme (lighter = fewer people, darker = more people)
- Special styling for 100% availability (dark green with white text)
- Purple ring indicator for user's own selections
- Clean tooltips showing exact participant counts
- Removed emojis for professional appearance

**Next Steps:**
- Add participants list with hover to show their slots
- Implement "Clear selection" functionality
- Add real-time updates when other users save their availability

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

### Current Implementation (Simplified Approach)
The anonymous user feature has been simplified to avoid complexity and edge cases:

1. **Anonymous users can**:
   - Create events without an account
   - Mark availability with a required name
   - All tracked via signed cookies with 30-day expiration

2. **When anonymous users sign up or log in**:
   - Events created anonymously → Transferred to user ownership
   - Availabilities marked anonymously → Remain anonymous (no conversion)
   - Cookie is cleared after login/signup

3. **Benefits of this approach**:
   - No unique constraint violations
   - No complex conflict resolution needed
   - No modals or user choices required
   - Simple, predictable behavior

4. **Trade-offs**:
   - Users may appear twice in participants list (once as authenticated, once as anonymous)
   - Anonymous availabilities are not automatically claimed
   - This is acceptable and matches behavior of many popular apps

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

### Conversion Flow (Simplified)

When anonymous users sign up or sign in, we only convert their events:

```ruby
# In ApplicationController
def convert_anonymous_to_authenticated(user)
  return if cookies.signed[:anonymous_session_id].blank?

  anonymous_session_id = cookies.signed[:anonymous_session_id]
  
  # Only convert events (ownership transfer)
  Event.where(anonymous_session_id:).update_all(event_creator_id: user.id, anonymous_session_id: nil)
  
  # Availabilities remain anonymous to avoid conflicts
  # This prevents unique constraint violations and complex merge logic
  
  cookies.delete(:anonymous_session_id)
  nil
end
```

**Important**: We intentionally do NOT convert availabilities to avoid:
- Unique constraint violations when user has already marked availability
- Complex conflict resolution logic
- Confusing user experiences across multiple events

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
6. **Timezone Support** - Added timezone to events table and selection in event creation
7. **Frontend Availability Save** - Working save functionality with proper state management
8. **Load Saved Selections** - Users see their previously saved availability when returning

### Completed ✅ (Recent)
1. **Edit/View Mode Implementation** - Clear separation between viewing and editing availability
   - Edit mode hides heatmap and shows simple selection UI
   - View mode shows full heatmap with everyone's availability
   - Edit/Save buttons in header for better mobile UX
2. **State Management with Zustand** - Centralized state management replacing prop drilling
   - Moved selectedSlots, hasUnsavedChanges, totalParticipants to store
   - Clean separation between saved state (currentUserSlots) and draft state (selectedSlots)
3. **Anonymous User Name Dialog** - Modal dialog for name input instead of sidebar
   - Matches InvitePeopleDialog styling for consistency
   - Progressive disclosure - only shown when saving
4. **UI/UX Improvements**
   - Violet/primary color heatmap matching brand identity
   - Orange selection indicators for clear visual hierarchy
   - Shake animation + scroll to Edit button when clicking in view mode
   - Percentage-based heatmap showing participant availability
5. **Participants List** - Minimal design showing who has responded
   - Clean, lightweight UI without heavy borders
   - Shows response status with subtle indicators

### Completed ✅ (Recent - Phase 2)
1. **Participants Backend API**
   - Added participants array to availabilities index response
   - Implemented TDD with 6 incremental tests
   - Refactored into clean, single-responsibility methods
   - Returns authenticated users, anonymous users, and invited users
2. **Participants List Frontend Integration**
   - Connected ParticipantsList to real backend data via Zustand
   - Added participants to eventStore for centralized state
   - Displays real participant names and response status
3. **Participant Hover Highlighting**
   - Highlights time slots when hovering over participant names
   - Uses orange border to show which slots a participant selected
   - Added slotId prop to TimeSlot component
4. **Current User Indicator**
   - Shows "(You)" next to current user in participants list
   - Works for both authenticated and anonymous users
   - Backend sets is_current_user flag for security

### Completed ✅ (Recent - Phase 3)
1. **Modal-Based Authentication System**
   - Replaced page-based auth with consistent modal experience
   - Added AuthModal to Navbar for global access
   - Updated SessionsController to handle modal requests:
     - Returns JSON errors with 422 status for failed auth
     - Uses `redirect_back` to keep users on their current page
     - Proper Inertia error handling without page refreshes
   - Converted LoginForm to use Inertia's `useForm` hook
   - Updated sessions_spec tests for new modal behavior
   - Removed unused `/session/new` and `/registration/new` routes

2. **User-Invitation Associations**
   - Added `sent_invitations` and `received_invitations` to User model
   - Implemented `pending_invitations_by_email` method
   - Created `link_pending_invitations!` to connect invitations when users sign up
   - Full TDD implementation with passing tests

### Completed ✅ (Recent - Phase 4: Anonymous User Flow)
1. **Simplified Anonymous User Conversion**
   - Implemented `convert_anonymous_to_authenticated` in ApplicationController
   - **Key Decision**: Only convert events, NOT availabilities to avoid conflicts
   - When anonymous user signs up/logs in:
     - Anonymous events → Transferred to user ownership
     - Anonymous availabilities → Remain anonymous (no conflicts possible)
   - Added to both RegistrationsController and SessionsController
   - Cookie cleared after conversion

2. **Conflict Avoidance Strategy**
   - Identified issue: Converting availabilities causes unique constraint violations
   - Solution: Keep anonymous availabilities separate from authenticated ones
   - Benefits:
     - No complex conflict resolution needed
     - No modals or user decisions required
     - Predictable, simple behavior
   - Trade-off: User may appear twice in participants list (as themselves and anonymous)

3. **Test Coverage**
   - Updated sessions_spec to verify events are converted
   - Added test to ensure availabilities are NOT converted
   - All tests passing with new simplified approach

### In Progress 🚧
1. **Security Enhancement** - Implement hashing for anonymous session IDs instead of exposing raw IDs
2. **Auto-link Invitations on Signup** - Call `link_pending_invitations!` in RegistrationsController
3. **Fix request_authentication** - Update for modal-based auth (currently commented out)

### Next Steps 📋
1. **Progressive Engagement UI**
   - Add prompts to sign up for notifications
   - Show benefits of creating an account
   - Implement smooth upgrade flow

2. **Consider Future Enhancements**
   - Option to claim anonymous availabilities manually
   - Better visual distinction between anonymous and authenticated participants
   - Analytics on anonymous → authenticated conversion rates

### Technical Debt to Address
- Remove `Events::Create` service file (low priority)
- Clean up old session-based event tracking code
- Add timezone tests for availabilities controller

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

### Test-Driven Development (TDD) Best Practices
- **Incremental Testing**: Write one test at a time, make it pass, then move to the next test
- **Red-Green-Refactor Cycle**: 
  1. Red: Write a failing test
  2. Green: Write minimal code to make it pass
  3. Refactor: Clean up the code while keeping tests green
- **Single Responsibility Tests**: Each test should verify one specific behavior
- **Clear Test Names**: Test names should describe what behavior is being tested
- **Refactor After Green**: Once tests pass, refactor for clarity and maintainability
- **Example from Project**: Successfully implemented participants data feature using TDD:
  1. Test for participants array presence → Add empty array
  2. Test for authenticated users → Implement authenticated logic
  3. Test for anonymous users → Add anonymous handling
  4. Test for multiple participants → Verify it works
  5. Test for invited users → Add invitation logic
  6. Refactor into separate methods for clarity

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

## Event Page UI Design

### Design Reference
The Event page UI design has been finalized and can be viewed at: `/tmp/event-page-refined.html`

Key design elements:
1. **Event Header Card** - Purple-tinted card similar to auth alert with event name, description, and action buttons
2. **Modern Sidebar** - Clean design without heavy card borders, featuring:
   - Stats section with slots/hours count
   - Sticky save button
   - Participant list with avatars and response times
   - Schedule action with gradient background
3. **Availability Grid** - Week view with 15-minute slots (updated from 30-minute), heat map for group availability
4. **Calendar Import Section** - Visual buttons for Google Calendar and Outlook import

The design follows shadcn principles with no gradients (except subtle accent on schedule card), clean typography, and intuitive interaction patterns.

### Component Structure
- **AvailabilityGrid**: Main grid component with refactored architecture
  - `AvailabilityGridHeader`: Column headers with dates
  - `DayColumn`: Individual day columns with time slots
  - `TimeColumn`: Time labels on the left
  - `TimeSlot`: Individual 15-minute slot with hover effects
  - `AvailabilityLegend`: Legend showing availability levels
- **CalendarImportSection**: Refactored into smaller components
  - `CalendarImportHeader`: Section header
  - `CalendarImportButtons`: Google/Outlook import buttons
  - `AvailabilityControls`: Control buttons for selection
  - `AvailabilitySection`: Wrapper for the grid

## Claude Code Guidelines

### Development Principles
- Never write content to the files unless explicitly requested

This guide should be updated as new features are implemented and architectural decisions are made.