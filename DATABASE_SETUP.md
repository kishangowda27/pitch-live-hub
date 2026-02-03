# Database Setup for PitchLive Hub

This document explains how to set up the Insforge database tables for PitchLive Hub.

## Prerequisites

- An Insforge account and project
- Access to your Insforge database SQL editor

## Database Tables

The application uses the following tables:

1. **user_profiles** - Stores user profile information (username, avatar, points, badges, etc.)
2. **user_settings** - Stores user preferences (notifications, theme, privacy settings)
3. **messages** - Stores chat messages for matches
4. **polls** - Stores poll questions and options
5. **poll_votes** - Stores user votes on polls
6. **matches** - Stores match information synced from CricAPI

## Setup Instructions

### Step 1: Run the SQL Schema

1. Open your Insforge dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Execute the SQL script

This will create all necessary tables with proper indexes.

### Step 2: Configure Row Level Security (Optional but Recommended)

If you want to enable Row Level Security (RLS) for data protection:

1. Uncomment the RLS policies in `database-schema.sql`
2. Adjust the policies based on your security requirements
3. Run the updated SQL script

### Step 3: Verify Tables

After running the schema, verify that all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'user_profiles', 
  'user_settings', 
  'messages', 
  'polls', 
  'poll_votes', 
  'matches'
);
```

## Data Flow

### User Profile & Settings
- **Saving**: When a user updates their profile or settings, data is saved to:
  - Insforge database (if user is logged in)
  - localStorage (as backup/for offline users)
- **Loading**: Data is loaded from:
  - Insforge database (primary source for logged-in users)
  - localStorage (fallback for non-logged-in users or if database fails)

### Messages
- Messages are saved to the `messages` table when users chat in match detail pages
- Each message includes: match_id, user_id, username, avatar_url, content, timestamp

### Polls
- Polls are created and stored in the `polls` table
- Votes are tracked in the `poll_votes` table with unique constraint (one vote per user per poll)

### Matches
- Matches are synced from CricAPI and stored in the `matches` table
- The sync happens automatically when matches are fetched

## Important Notes

1. **User ID**: The `user_id` field in `user_profiles` and `user_settings` should match the authenticated user's ID from Insforge Auth.

2. **Upsert Operations**: The app uses upsert operations (INSERT ... ON CONFLICT UPDATE) to handle both new users and updates to existing profiles.

3. **Fallback to localStorage**: If the database is unavailable or the user is not logged in, the app falls back to localStorage for profile data.

4. **Badges**: Badges are stored as an array of badge IDs in the `user_profiles.badges` column.

## Troubleshooting

### Profile not saving
- Check that the `user_profiles` table exists
- Verify that the user is authenticated (check `authUser?.id`)
- Check browser console for error messages
- Verify Insforge connection and API keys

### Settings not persisting
- Check that the `user_settings` table exists
- Verify the upsert operation is working (check for unique constraint on `user_id`)
- Check browser console for errors

### Messages not appearing
- Verify the `messages` table exists
- Check that messages are being inserted (check browser console)
- Verify the match_id is correct

## Next Steps

After setting up the database:
1. Test creating a user profile
2. Test updating settings
3. Test sending messages in a match
4. Test creating and voting on polls

All data should now be persisted in your Insforge database!
