-- AI Response Cache Table
-- Used to cache AI completions for 30 days to reduce API costs

CREATE TABLE IF NOT EXISTS ai_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_hash VARCHAR(64) NOT NULL,
  model VARCHAR(50) NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Composite unique constraint for upsert
  CONSTRAINT ai_cache_unique UNIQUE (prompt_hash, model)
);

-- Index for fast lookups by prompt hash and model
CREATE INDEX IF NOT EXISTS idx_ai_cache_lookup ON ai_cache (prompt_hash, model);

-- Index for cleanup of expired entries
CREATE INDEX IF NOT EXISTS idx_ai_cache_expires ON ai_cache (expires_at);

-- Enable Row Level Security
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all authenticated users to read from cache (shared cache)
CREATE POLICY "Anyone can read cache" ON ai_cache
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert into cache
CREATE POLICY "Authenticated users can insert cache" ON ai_cache
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow updates (for upsert)
CREATE POLICY "Allow cache updates" ON ai_cache
  FOR UPDATE
  USING (true);

-- Policy: Allow cleanup of expired entries
CREATE POLICY "Allow cache deletion" ON ai_cache
  FOR DELETE
  USING (expires_at < NOW());

-- Function to clean up expired cache entries (run via cron job)
CREATE OR REPLACE FUNCTION cleanup_expired_ai_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM ai_cache WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comment for documentation
COMMENT ON TABLE ai_cache IS 'Caches AI completion responses for 30 days to reduce API costs';
COMMENT ON COLUMN ai_cache.prompt_hash IS 'Hash of the prompt + model for quick lookup';
COMMENT ON COLUMN ai_cache.expires_at IS 'When this cache entry expires (30 days from creation)';
