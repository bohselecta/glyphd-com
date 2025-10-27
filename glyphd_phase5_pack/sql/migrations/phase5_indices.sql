CREATE INDEX IF NOT EXISTS idx_feed_posts_created_at ON feed_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feed_posts_featured_likes ON feed_posts (featured, likes DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_unique ON likes (feed_id, by);
CREATE UNIQUE INDEX IF NOT EXISTS idx_collab_votes_unique ON collab_votes (collab_id, proposal_id, user_id);
CREATE INDEX IF NOT EXISTS idx_builder_events_user_ts ON builder_events (user, ts DESC);
