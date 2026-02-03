-- Insforge Database Schema for PitchLive Hub
-- Run these SQL commands in your Insforge database to create the necessary tables

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 999,
  comments_count INTEGER DEFAULT 0,
  votes_count INTEGER DEFAULT 0,
  predictions_correct INTEGER DEFAULT 0,
  predictions_total INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT false,
  show_email BOOLEAN DEFAULT false,
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages Table (if not already exists)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id TEXT,
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Polls Table (if not already exists)
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id TEXT,
  question TEXT NOT NULL,
  options JSONB,
  correct_option TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poll Votes Table (if not already exists)
CREATE TABLE IF NOT EXISTS poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL,
  user_id UUID,
  selected_option TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- Matches Table (if not already exists)
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT,
  series_id TEXT,
  name TEXT,
  match_type TEXT,
  status TEXT,
  venue TEXT,
  match_date DATE,
  match_datetime_gmt TIMESTAMPTZ,
  team1 JSONB,
  team2 JSONB,
  is_wc_2026 BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_polls_match_id ON polls(match_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON poll_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_external_id ON matches(external_id);
CREATE INDEX IF NOT EXISTS idx_matches_is_wc_2026 ON matches(is_wc_2026);

-- Enable Row Level Security (RLS) if needed
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your security requirements)
-- CREATE POLICY "Users can view their own profile" ON user_profiles
--   FOR SELECT USING (auth.uid() = user_id);
-- 
-- CREATE POLICY "Users can update their own profile" ON user_profiles
--   FOR UPDATE USING (auth.uid() = user_id);
-- 
-- CREATE POLICY "Users can insert their own profile" ON user_profiles
--   FOR INSERT WITH CHECK (auth.uid() = user_id);
