# Live Chat Setup Guide

This guide explains how to set up the live chat system that stores data both in Insforge database and locally in the web app.

## Database Setup

### 1. Run the Database Schema

Execute the SQL commands in `database-chat-schema.sql` in your Insforge database:

```sql
-- This will create all necessary tables:
-- - chat_messages: Store all chat messages
-- - chat_reactions: Store message reactions (likes, emojis)
-- - chat_users: Track online users per match
-- - chat_sessions: Track user session statistics
```

### 2. Environment Variables

Make sure you have the Insforge configuration in your environment:

```env
VITE_INSFORGE_ANON_KEY=your_insforge_anon_key_here
```

## Features

### Real-time Chat
- ✅ Messages stored in Insforge database
- ✅ Messages cached locally for offline access
- ✅ Real-time updates via Insforge realtime subscriptions
- ✅ Automatic retry for failed messages
- ✅ Offline message queuing

### Message Features
- ✅ Text messages
- ✅ Message reactions (emojis)
- ✅ Reply to messages
- ✅ User avatars and usernames
- ✅ Message timestamps
- ✅ Message persistence

### User Management
- ✅ Online user tracking
- ✅ User session tracking
- ✅ Custom usernames and avatars
- ✅ User activity statistics

### Data Storage
- ✅ **Insforge Database**: Primary storage for all chat data
- ✅ **Local Storage**: Caching and offline support
- ✅ **Automatic Sync**: Syncs local data with database
- ✅ **Data Export/Import**: Backup and restore functionality

## Usage

### Basic Usage

```tsx
import { LiveChat } from '@/components/chat/LiveChat';

// Add to any page where you want live chat
<LiveChat matchId="match_123" />
```

### Advanced Usage with Custom Settings

```tsx
import { useChat } from '@/hooks/useChat';

const MyComponent = () => {
  const {
    messages,
    users,
    isConnected,
    sendMessage,
    addReaction,
    setUserInfo
  } = useChat('match_123');

  // Custom implementation
  return (
    <div>
      {/* Your custom chat UI */}
    </div>
  );
};
```

## Data Flow

### Message Sending Flow
1. User types message and clicks send
2. Message immediately added to local storage (optimistic update)
3. UI updates instantly showing the message
4. Message sent to Insforge database
5. Real-time subscription notifies all connected users
6. Message marked as synced in local storage

### Message Receiving Flow
1. Another user sends a message
2. Insforge real-time subscription receives the message
3. Message added to local storage
4. UI updates to show new message
5. Auto-scroll to latest message

### Offline Support
1. When offline, messages are stored locally
2. Messages marked as "unsynced"
3. When connection restored, unsynced messages are sent to database
4. Failed messages are retried automatically

## Database Schema

### chat_messages
- `id`: UUID primary key
- `match_id`: Match identifier
- `user_id`: User identifier
- `username`: Display name
- `avatar`: User avatar (emoji)
- `message`: Message content
- `timestamp`: When message was sent
- `reply_to`: ID of message being replied to
- `message_type`: 'text', 'reaction', or 'system'
- `is_deleted`: Soft delete flag

### chat_reactions
- `id`: UUID primary key
- `message_id`: Reference to chat_messages
- `user_id`: User who reacted
- `emoji`: Reaction emoji
- `timestamp`: When reaction was added

### chat_users
- `id`: User identifier
- `username`: Display name
- `avatar`: User avatar
- `match_id`: Current match
- `is_online`: Online status
- `last_seen`: Last activity timestamp

### chat_sessions
- `id`: UUID primary key
- `user_id`: User identifier
- `match_id`: Match identifier
- `session_start`: Session start time
- `session_end`: Session end time
- `messages_sent`: Number of messages sent
- `reactions_given`: Number of reactions given

## Performance Considerations

### Database Optimization
- Indexes on frequently queried columns
- Row Level Security (RLS) policies
- Automatic cleanup of old data
- Efficient real-time subscriptions

### Local Storage Optimization
- Automatic cleanup of old cached data
- Compression for large datasets
- Efficient sync algorithms
- Memory usage monitoring

### Real-time Performance
- Debounced updates to prevent spam
- Connection pooling
- Automatic reconnection
- Graceful degradation when offline

## Security Features

- Row Level Security (RLS) enabled
- Input sanitization
- Rate limiting (can be added)
- User authentication integration
- Message content filtering (can be added)

## Monitoring & Analytics

The system tracks:
- Message volume per match
- User engagement metrics
- Session duration
- Popular reaction types
- Peak usage times

## Troubleshooting

### Common Issues

1. **Messages not appearing**
   - Check Insforge connection
   - Verify database permissions
   - Check browser console for errors

2. **Real-time updates not working**
   - Verify Insforge realtime configuration
   - Check network connectivity
   - Ensure proper channel subscription

3. **Local storage issues**
   - Clear browser cache
   - Check storage quota
   - Verify localStorage permissions

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('chat_debug', 'true');
```

This will log all chat operations to the browser console.