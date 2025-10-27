# Database Schema

This document describes the database schema for the Glyphd Builder Network.

## SQLite/Supabase Tables

```sql
-- Feed posts (public marks)
CREATE TABLE feed_posts (
  id TEXT PRIMARY KEY,
  mark_id TEXT NOT NULL,
  author TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  hero TEXT,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  collabs INT DEFAULT 0,
  featured BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT (strftime('%s', 'now'))
);

-- User likes (prevents double-like)
CREATE TABLE likes (
  id TEXT PRIMARY KEY,
  feed_id TEXT NOT NULL,
  by_user TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT (strftime('%s', 'now')),
  UNIQUE(feed_id, by_user)
);

-- Builder events (append-only log)
CREATE TABLE builder_events (
  id TEXT PRIMARY KEY,
  user TEXT NOT NULL,
  type TEXT NOT NULL,
  mark_id TEXT NOT NULL,
  meta JSON,
  ts TIMESTAMP DEFAULT (strftime('%s', 'now'))
);

-- User profiles
CREATE TABLE profiles (
  username TEXT PRIMARY KEY,
  bio TEXT,
  rating INT DEFAULT 0,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT (strftime('%s', 'now'))
);

-- Collaborations (for Phase 4.5)
CREATE TABLE collabs (
  id TEXT PRIMARY KEY,
  mark_id TEXT NOT NULL,
  owner TEXT NOT NULL,
  participants JSON,
  current_turn TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT (strftime('%s', 'now'))
);

-- Votes on collaboration rounds (for Phase 4.5)
CREATE TABLE votes (
  id TEXT PRIMARY KEY,
  collab_id TEXT NOT NULL,
  round_id TEXT NOT NULL,
  by_user TEXT NOT NULL,
  decision TEXT NOT NULL, -- 'merge' or 'revert'
  created_at TIMESTAMP DEFAULT (strftime('%s', 'now')),
  UNIQUE(collab_id, round_id, by_user)
);
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_feed_trending ON feed_posts(created_at, likes + comments DESC);
CREATE INDEX idx_feed_featured ON feed_posts(featured DESC, collabs DESC);
CREATE INDEX idx_likes_user ON likes(by_user);
CREATE INDEX idx_events_user ON builder_events(user, ts DESC);
```

## File System Storage (Current)

### Mark Metadata
`apps/web/public/symbols/[slug]/metadata.json`
```json
{
  "title": "string",
  "author": "string",
  "description": "string",
  "heroImage": "string",
  "private": "boolean",
  "feedPosted": "boolean",
  "likes": "number",
  "comments": "number",
  "collabRequests": "number",
  "createdAt": "string",
  "feedPostedAt": "string"
}
```

### Like Tracking
`apps/web/public/symbols/[slug]/likes.json`
```json
[
  { "userId": "string", "timestamp": "string" }
]
```

### Builder Points
`apps/web/public/builders/[username].json`
```json
{
  "username": "string",
  "points": "number",
  "likes": "number",
  "comments": "number",
  "merges": "number",
  "acceptedCollabs": "number",
  "featured": "number",
  "abandoned": "number",
  "lastUpdated": "string"
}
```

### Builder Events (Append-only)
`apps/web/public/builders/events/events.json`
```json
[
  {
    "type": "like|comment|collab.accepted|collab.merge|featured|collab.abandoned",
    "by": "string",
    "markId": "string",
    "ts": "number",
    "helpful"?: "boolean"
  }
]
```

## Migration Path

When moving from file system to SQLite/Supabase:

1. **Export**: Read all `metadata.json`, `likes.json`, and builder files
2. **Transform**: Convert to table INSERT statements
3. **Import**: Run migration script to populate database
4. **Verify**: Backfill points from events

```bash
npm run migrate:fs-to-db
```

