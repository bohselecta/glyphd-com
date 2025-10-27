-- Phase 5: Performance and integrity indices

-- Feed posts indices
CREATE INDEX IF NOT EXISTS idx_feed_posts_created_at ON feed_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feed_posts_featured_likes ON feed_posts (featured, likes DESC);

-- Likes unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_unique ON likes (feed_id, by);

-- Collab votes unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_collab_votes_unique ON collab_votes (collab_id, proposal_id, user_id);

-- Builder events index
CREATE INDEX IF NOT EXISTS idx_builder_events_user_ts ON builder_events (user, ts DESC);

-- Comments index
CREATE INDEX IF NOT EXISTS idx_comments_mark_created ON comments (mark_id, created_at DESC);

-- Follows index
CREATE INDEX IF NOT EXISTS idx_follows_user ON follows (user_id, created_at DESC);

