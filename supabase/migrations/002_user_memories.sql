-- Migration: Add user_memories table for AI Memory System
-- Oracle AI Buddy — Human in the Loop

-- Create memory type enum
CREATE TYPE memory_type AS ENUM (
  'preference',  -- User preferences (learning style, interests)
  'fact',        -- Facts about user (name, goals)
  'summary',     -- Conversation summaries
  'context',     -- Current learning context
  'feedback'     -- User feedback on AI responses
);

-- Create user_memories table
CREATE TABLE IF NOT EXISTS user_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type memory_type NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  importance INTEGER DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_user_memories_user_id ON user_memories(user_id);
CREATE INDEX idx_user_memories_type ON user_memories(type);
CREATE INDEX idx_user_memories_importance ON user_memories(importance DESC);
CREATE INDEX idx_user_memories_key ON user_memories(key);

-- Unique constraint on user_id + key (one memory per key per user)
CREATE UNIQUE INDEX idx_user_memories_user_key ON user_memories(user_id, key);

-- Enable Row Level Security
ALTER TABLE user_memories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own memories
CREATE POLICY "Users can view own memories"
  ON user_memories FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own memories
CREATE POLICY "Users can insert own memories"
  ON user_memories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own memories
CREATE POLICY "Users can update own memories"
  ON user_memories FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own memories
CREATE POLICY "Users can delete own memories"
  ON user_memories FOR DELETE
  USING (auth.uid() = user_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_user_memories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
CREATE TRIGGER trigger_user_memories_updated_at
  BEFORE UPDATE ON user_memories
  FOR EACH ROW
  EXECUTE FUNCTION update_user_memories_updated_at();

-- Comment on table
COMMENT ON TABLE user_memories IS 'Stores AI memory for each user - preferences, facts, summaries, context';
