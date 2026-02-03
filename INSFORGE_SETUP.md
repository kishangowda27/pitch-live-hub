# InsForge Setup Instructions

## Current Status
- ✅ InsForge SDK is installed (`@insforge/sdk`)
- ✅ Database schema is ready (`database-schema.sql`)
- ✅ Polls functionality is implemented
- ⚠️ **Need to set up anon key**

## To Enable InsForge Database Connection:

### 1. Get Your Anon Key
1. Go to your InsForge dashboard
2. Navigate to your project settings
3. Find the "API Keys" or "Authentication" section
4. Copy your **anon key** (public key for client-side use)

### 2. Update Environment Variables
1. Open `pitch-live-hub/.env`
2. Replace this line:
   ```
   VITE_INSFORGE_ANON_KEY=your-actual-anon-key-from-insforge-dashboard
   ```
   With your actual anon key:
   ```
   VITE_INSFORGE_ANON_KEY=your-real-anon-key-here
   ```

### 3. Restart Development Server
```bash
cd pitch-live-hub
npm run dev
```

## What Works Now:
- ✅ **Polls display**: Shows 10 dummy polls with voting functionality
- ✅ **Poll creation**: Create new polls (will save to InsForge once anon key is set)
- ✅ **Dark theme**: Consistent dark styling throughout
- ✅ **Responsive design**: Works on all screen sizes

## What Will Work After Setting Anon Key:
- 🔄 **Real-time polls**: Polls will be saved to and loaded from InsForge database
- 🔄 **Persistent voting**: Votes will be stored in the database
- 🔄 **Cross-device sync**: Polls will sync across all devices

## Database Tables Created:
- `polls` - Stores poll questions and options
- `poll_votes` - Stores user votes
- `matches` - Stores match data
- `messages` - For chat functionality
- `user_profiles` - User information

## Current InsForge Configuration:
- **Base URL**: `https://ucu4jcd5.ap-southeast.insforge.app`
- **Database**: PostgreSQL with PostgREST API
- **Real-time**: WebSocket subscriptions ready

Once you set up the anon key, all polls you create will be automatically saved to your InsForge database and will persist across sessions!