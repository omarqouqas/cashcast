-- ============================================
-- AI Query Usage tracking table
-- Tracks daily query counts for rate limiting
-- Free tier: 5 queries/day, Pro: unlimited
-- ============================================

CREATE TABLE IF NOT EXISTS ai_query_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query_date DATE NOT NULL DEFAULT CURRENT_DATE,
  query_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one row per user per day
  CONSTRAINT ai_query_usage_user_date_unique UNIQUE (user_id, query_date)
);

-- Enable Row Level Security
ALTER TABLE ai_query_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own usage
DROP POLICY IF EXISTS "Users can view own usage" ON ai_query_usage;
CREATE POLICY "Users can view own usage"
  ON ai_query_usage FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own usage" ON ai_query_usage;
CREATE POLICY "Users can insert own usage"
  ON ai_query_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own usage" ON ai_query_usage;
CREATE POLICY "Users can update own usage"
  ON ai_query_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for fast lookups by user and date
CREATE INDEX IF NOT EXISTS idx_ai_query_usage_user_date ON ai_query_usage(user_id, query_date);

-- Add comment for documentation
COMMENT ON TABLE ai_query_usage IS 'Tracks daily AI query usage per user for rate limiting (free tier: 5/day)';

-- ============================================
-- Function for atomic increment of query count
-- Uses UPSERT to handle race conditions
-- ============================================

CREATE OR REPLACE FUNCTION increment_ai_query_usage(p_user_id UUID, p_query_date DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO ai_query_usage (user_id, query_date, query_count)
  VALUES (p_user_id, p_query_date, 1)
  ON CONFLICT (user_id, query_date)
  DO UPDATE SET
    query_count = ai_query_usage.query_count + 1,
    updated_at = NOW();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_ai_query_usage(UUID, DATE) TO authenticated;

COMMENT ON FUNCTION increment_ai_query_usage IS 'Atomically increments the AI query count for a user on a given date';
