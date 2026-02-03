# PitchLive Hub - Product Specification Document

## 1. Executive Summary

**Product Name:** PitchLive Hub  
**Version:** 1.0.0  
**Last Updated:** February 2026  
**Product Type:** Web Application (React SPA)  
**Target Audience:** Cricket fans, sports enthusiasts, World Cup 2026 viewers

PitchLive Hub is a comprehensive social platform designed for cricket fans to engage with the World Cup 2026. It provides real-time match updates, live chat, polls, predictions, leaderboards, and community features that enhance the viewing experience.

---

## 2. Product Overview

### 2.1 Vision Statement
To create the ultimate companion platform for cricket fans during World Cup 2026, enabling real-time engagement, social interaction, and competitive participation through live chat, polls, predictions, and community features.

### 2.2 Mission
Provide cricket fans with a seamless, interactive platform to:
- Follow live matches with real-time updates
- Engage in match discussions through live chat
- Participate in polls and predictions
- Compete on leaderboards
- Connect with the cricket community

### 2.3 Key Value Propositions
1. **Real-time Engagement**: Live match updates, chat, and reactions
2. **Social Interaction**: Connect with other cricket fans
3. **Gamification**: Points, badges, leaderboards, and predictions
4. **Comprehensive Coverage**: Matches, players, series, and statistics
5. **Modern UX**: Beautiful, responsive, and intuitive interface

---

## 3. Product Features

### 3.1 Core Features

#### 3.1.1 Authentication & User Management
- **User Registration**
  - Email/password registration
  - OAuth integration (Google, GitHub)
  - Profile creation with username and avatar
  - Terms and conditions acceptance

- **User Login**
  - Email/password authentication
  - OAuth login options
  - Session management
  - Remember me functionality

- **User Profile**
  - Customizable username
  - Avatar selection (DiceBear integration)
  - Points and ranking display
  - Badge collection
  - Statistics dashboard (comments, votes, predictions)
  - Prediction accuracy tracking
  - Join date and activity history

- **Settings Management**
  - Username and avatar customization
  - Notification preferences (push, email)
  - Privacy settings (show/hide email)
  - Theme selection (dark, light, auto)
  - Account information display

#### 3.1.2 Match Management

- **Match Listing Page**
  - Filter matches by status (All, Live, Upcoming, Completed)
  - Match cards with team information
  - Score display for live/completed matches
  - Venue and date information
  - Quick navigation to match details

- **Match Detail Page**
  - Live scoreboard with team scores and overs
  - Match information (venue, date, time, toss)
  - Run rate and statistics
  - Live status indicator
  - Team flags and names
  - Match type and tournament information

- **Match Data Sources**
  - CricAPI integration for real-time match data
  - Automatic sync to Insforge database
  - Fallback to dummy data when API unavailable
  - Auto-refresh every 60 seconds

#### 3.1.3 Live Chat System

- **Chat Features**
  - Real-time messaging during matches
  - Message persistence in database
  - User avatars and usernames
  - Message timestamps
  - Auto-scroll to latest messages
  - Message reactions (emojis)
  - Reply to messages
  - Online user tracking

- **Chat Storage**
  - Primary: Insforge database
  - Backup: LocalStorage for offline support
  - Real-time synchronization
  - Message queuing for offline users

- **Chat UI**
  - Scrollable message container
  - Message input with send button
  - Enter key to send
  - Message count display
  - User presence indicators

#### 3.1.4 Polls & Voting

- **Poll Features**
  - Create polls with multiple options
  - Vote on polls (one vote per user per poll)
  - Poll categories (match, player, prediction, fun)
  - Poll status (active, closed)
  - Vote count and percentages
  - Poll filtering (all, active, trending, completed)

- **Poll Management**
  - Create poll modal with question and options
  - Add/remove poll options dynamically
  - Link polls to specific matches
  - Display poll results with visual progress bars
  - Poll expiration dates

#### 3.1.5 Predictions

- **Score Predictions**
  - Predict final match scores
  - Submit predictions before/during matches
  - Track prediction accuracy
  - Points awarded for correct predictions
  - Win probability display

- **Prediction Tracking**
  - User prediction history
  - Correct vs incorrect predictions
  - Accuracy percentage calculation
  - Points earned from predictions

#### 3.1.6 Leaderboard

- **Ranking System**
  - Points-based ranking
  - Top 3 podium display
  - Full leaderboard list
  - User position highlighting
  - Points breakdown by activity

- **Points System**
  - Post a comment: +10 points
  - Vote in poll: +5 points
  - Correct prediction: +20 points
  - Daily login: +3 points

- **Badges**
  - Cricket Legend (Top 10)
  - Prediction Master (10+ correct predictions)
  - Social Star (100+ comments)
  - Early Bird (Joined during launch)
  - Poll Warrior (50+ poll votes)
  - Superfan (7 consecutive days active)

#### 3.1.7 Series & Players

- **Series Page**
  - List of cricket series
  - Series information (dates, match counts)
  - Search functionality
  - Series type breakdown (ODI, T20, Test)
  - Squad information

- **Players Page**
  - Browse players by country
  - Search players by name
  - Player information display
  - Pagination support
  - Country filtering

- **T20 World Cup Hub**
  - Dedicated World Cup page
  - Fixtures and matchups
  - Team squads
  - Player listings by team
  - World Cup leaderboard

#### 3.1.8 Home Page

- **Hero Section**
  - Animated hero with scroll-triggered effects
  - Call-to-action buttons
  - Statistics display (active fans, comments, polls, predictions)
  - Scroll hint indicator

- **Content Sections**
  - Live matches showcase
  - Upcoming matches preview
  - Trending polls
  - Community highlights (trending comments)
  - Top fans leaderboard preview

---

## 4. Technical Architecture

### 4.1 Technology Stack

**Frontend:**
- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19
- React Router 6.30.1
- TanStack Query 5.83.0
- Framer Motion 12.30.1
- Tailwind CSS 3.4.17
- shadcn/ui components

**Backend Services:**
- Insforge SDK 1.1.5
  - Authentication
  - Database (PostgreSQL)
  - Real-time subscriptions
  - Storage

**External APIs:**
- CricAPI (cricket data)
- DiceBear API (avatar generation)

**State Management:**
- React Context (Auth)
- TanStack Query (server state)
- LocalStorage (offline data)

### 4.2 Database Schema

**Tables:**
1. `user_profiles` - User profile information
2. `user_settings` - User preferences
3. `messages` - Chat messages
4. `polls` - Poll questions and options
5. `poll_votes` - User votes
6. `matches` - Match data
7. `chat_messages` - Enhanced chat messages
8. `chat_reactions` - Message reactions
9. `chat_users` - Online user tracking
10. `chat_sessions` - Session statistics

### 4.3 Data Flow

**Profile & Settings:**
- Primary: Insforge database
- Fallback: LocalStorage
- Real-time sync on changes

**Messages:**
- Optimistic updates (local first)
- Database persistence
- Real-time broadcasting
- Offline queuing

**Matches:**
- CricAPI → Insforge database
- Client-side caching
- Auto-refresh every 60s

---

## 5. User Flows

### 5.1 New User Registration Flow
1. User visits homepage
2. Clicks "Sign Up" or navigates to `/signup`
3. Enters email and password (or uses OAuth)
4. Creates username and selects avatar
5. Redirected to homepage
6. Profile created in database

### 5.2 Match Viewing Flow
1. User browses matches on `/matches`
2. Filters by status (live, upcoming, completed)
3. Clicks on a match card
4. Views match detail page with:
   - Live scoreboard
   - Live chat
   - Match polls
   - Score prediction
   - Reactions

### 5.3 Chat Participation Flow
1. User opens match detail page
2. Scrolls to live chat section
3. Types message in input field
4. Clicks send or presses Enter
5. Message appears immediately (optimistic update)
6. Message saved to database
7. Other users see message in real-time

### 5.4 Poll Creation & Voting Flow
1. User navigates to `/polls`
2. Clicks "Create Poll" button
3. Enters question and options
4. Submits poll
5. Poll appears in polls list
6. Users vote on poll
7. Results update in real-time

### 5.5 Profile Customization Flow
1. User navigates to `/profile`
2. Clicks settings icon
3. Opens settings modal
4. Updates username, avatar, or preferences
5. Clicks "Save Changes"
6. Changes saved to database and localStorage
7. Profile updates immediately

---

## 6. User Interface & Design

### 6.1 Design System

**Color Palette:**
- Primary: Cricket green/blue
- Background: Dark theme with glass morphism
- Accent: Gold for achievements
- Status: Red (live), Blue (upcoming), Green (completed)

**Typography:**
- Display font for headings
- System font for body text
- Responsive font sizes

**Components:**
- Glass-morphism cards
- Animated transitions
- Responsive grid layouts
- Mobile-first design

### 6.2 Key Pages

1. **Home Page (`/`)**
   - Hero section with animation
   - Live matches grid
   - Trending polls
   - Community highlights
   - Leaderboard preview

2. **Matches Page (`/matches`)**
   - Filter buttons
   - Match cards grid
   - Status badges
   - Quick match info

3. **Match Detail (`/match/:id`)**
   - Three-column layout:
     - Left: Live chat
     - Center: Match info & scoreboard
     - Right: Polls & predictions

4. **Profile Page (`/profile`)**
   - Profile header with avatar
   - Statistics grid
   - Prediction accuracy chart
   - Badges collection
   - Settings modal

5. **Polls Page (`/polls`)**
   - Filter buttons
   - Poll cards grid
   - Create poll modal

6. **Leaderboard (`/leaderboard`)**
   - Top 3 podium
   - Full rankings list
   - Points system explanation

---

## 7. Performance Requirements

### 7.1 Load Times
- Initial page load: < 3 seconds
- Route navigation: < 500ms
- API responses: < 2 seconds
- Real-time updates: < 100ms latency

### 7.2 Scalability
- Support 10,000+ concurrent users
- Handle 100+ messages per second
- Support 1,000+ active polls
- Database queries optimized with indexes

### 7.3 Offline Support
- LocalStorage caching
- Offline message queuing
- Graceful degradation
- Data sync on reconnection

---

## 8. Security & Privacy

### 8.1 Authentication
- Secure password hashing
- OAuth 2.0 integration
- Session management
- Token refresh

### 8.2 Data Protection
- Row Level Security (RLS) on database
- User data encryption
- Privacy settings
- GDPR compliance considerations

### 8.3 Content Moderation
- Message content validation
- Spam prevention
- User reporting (future feature)
- Admin moderation tools (future feature)

---

## 9. Future Enhancements

### 9.1 Planned Features
- Push notifications
- Email notifications
- Mobile app (React Native)
- Advanced analytics
- Social sharing
- Match highlights
- Video integration
- Fantasy cricket

### 9.2 Improvements
- Enhanced real-time features
- Better offline support
- Performance optimizations
- Accessibility improvements
- Internationalization (i18n)
- Advanced search
- User following system

---

## 10. Success Metrics

### 10.1 Key Performance Indicators (KPIs)
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Messages sent per day
- Polls created per day
- User retention rate
- Average session duration
- Points earned per user
- Prediction accuracy rate

### 10.2 Engagement Metrics
- Comments per match
- Votes per poll
- Predictions submitted
- Badges earned
- Leaderboard participation

---

## 11. Deployment & Infrastructure

### 11.1 Hosting
- Frontend: Vite build for static hosting
- Backend: Insforge cloud platform
- Database: PostgreSQL via Insforge
- CDN: For static assets

### 11.2 Environment Variables
- `VITE_INSFORGE_ANON_KEY`: Insforge anonymous key
- `VITE_INSFORGE_BASE_URL`: Insforge API URL

### 11.3 Build Process
- Development: `npm run dev` (port 8080)
- Production: `npm run build`
- Preview: `npm run preview`

---

## 12. Documentation

### 12.1 Available Documentation
- `README.md`: Project overview
- `DATABASE_SETUP.md`: Database setup guide
- `CHAT_SETUP.md`: Chat system setup
- `database-schema.sql`: Database schema
- `database-chat-schema.sql`: Chat schema

### 12.2 Code Documentation
- TypeScript types and interfaces
- Component documentation
- API integration guides
- Hook usage examples

---

## 13. Support & Maintenance

### 13.1 Error Handling
- Graceful error messages
- Fallback to dummy data
- Retry mechanisms
- Error logging

### 13.2 Monitoring
- Console error tracking
- Performance monitoring
- User analytics
- Database query monitoring

---

## 14. Conclusion

PitchLive Hub is a comprehensive social platform for cricket fans, providing real-time engagement, community features, and gamification elements. The platform leverages modern web technologies, real-time data synchronization, and a user-friendly interface to create an immersive World Cup 2026 experience.

The product specification serves as a living document and should be updated as the product evolves and new features are added.

---

**Document Version:** 1.0.0  
**Last Updated:** February 2026  
**Maintained By:** Development Team
