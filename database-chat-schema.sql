-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    avatar VARCHAR(10),
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    reply_to UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'reaction', 'system')),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Reactions Table
CREATE TABLE IF NOT EXISTS chat_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- Chat Users Table (for tracking online status)
CREATE TABLE IF NOT EXISTS chat_users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    avatar VARCHAR(10),
    match_id VARCHAR(255) NOT NULL,
    is_online BOOLEAN DEFAULT TRUE,
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Sessions Table (for tracking user sessions)
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    match_id VARCHAR(255) NOT NULL,
    session_start TIMESTAMPTZ DEFAULT NOW(),
    session_end TIMESTAMPTZ,
    messages_sent INTEGER DEFAULT 0,
    reactions_given INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_match_id ON chat_messages(match_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_reactions_message_id ON chat_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_users_match_id ON chat_users(match_id);
CREATE INDEX IF NOT EXISTS idx_chat_users_online ON chat_users(match_id, is_online);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_match_user ON chat_sessions(match_id, user_id);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow all operations for now, you can restrict later)
CREATE POLICY "Allow all operations on chat_messages" ON chat_messages FOR ALL USING (true);
CREATE POLICY "Allow all operations on chat_reactions" ON chat_reactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on chat_users" ON chat_users FOR ALL USING (true);
CREATE POLICY "Allow all operations on chat_sessions" ON chat_sessions FOR ALL USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_users_updated_at BEFORE UPDATE ON chat_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up old chat data (optional)
CREATE OR REPLACE FUNCTION cleanup_old_chat_data()
RETURNS void AS $$
BEGIN
    -- Delete messages older than 30 days
    DELETE FROM chat_messages WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Delete offline users not seen for 24 hours
    DELETE FROM chat_users WHERE is_online = false AND last_seen < NOW() - INTERVAL '24 hours';
    
    -- Delete old sessions
    DELETE FROM chat_sessions WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ language 'plpgsql';