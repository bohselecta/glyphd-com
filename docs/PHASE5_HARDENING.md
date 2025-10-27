# Phase 5 — Hardening & Scale

Complete security and performance hardening for Glyphd.

---

## Security Features

### Middleware (`apps/web/middleware.ts`)

**Security Headers:**
- `X-Frame-Options: DENY` — Prevent clickjacking
- `X-Content-Type-Options: nosniff` — MIME type protection
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — Disable camera, mic, geolocation
- `Strict-Transport-Security` — Force HTTPS
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

**Auth Guards:**
- Public paths whitelist (GET only)
- Token validation for protected routes
- CSRF protection on state-changing methods

**CSRF Protection:**
```typescript
if (!sameOrigin && !csrfToken) {
  return 403
}
```

### Rate Limiting

**Comments:** 10 requests per minute per IP
```typescript
limit(`rl:comment:${ip}:${minute}`, 60, 10)
```

**Follow:** 30 requests per minute per user
```typescript
limit(`rl:follow:${userId}:${minute}`, 60, 30)
```

---

## New API Endpoints

### Comments
- `GET /api/comments/list?markId=...` — List comments
- `POST /api/comments/create` — Create comment (rate limited)

### Follow
- `POST /api/follow/toggle` — Toggle follow (rate limited)

---

## Real-time Support

### `useCollabChannel.ts`
React hook for collaboration real-time updates.

```typescript
const { on, emit } = useCollabChannel(collabId)

on('proposal_submitted', (data) => {
  // Handle new proposal
})
```

### `server.ts`
Broadcast utilities (Pusher/Supabase ready).

```typescript
await broadcast('collab-123', 'proposal_submitted', { ... })
```

---

## Cron Jobs

### Turn Timeout (`scripts/cron/turnTimeout.ts`)
- Runs every 10 minutes
- Checks for expired turns
- Auto-advances after 24h
- Marks abandoned after 2 timeouts
- Emits `collab.abandoned` event

### Reputation Backfill (`scripts/cron/reputationBackfill.ts`)
- Runs nightly
- Recomputes builder points from events
- Ensures consistency

---

## SQL Indices

Applied via `sql/migrations/phase5_indices.sql`:

- Feed posts: `created_at DESC`, `featured + likes`
- Likes: unique constraint on `(feed_id, by)`
- Collab votes: unique constraint on `(collab_id, proposal_id, user_id)`
- Builder events: `user + ts DESC` for fast lookups
- Comments: `mark_id + created_at`
- Follows: `user_id + created_at`

---

## Deployment

### Environment Variables
```bash
REALTIME_PROVIDER=memory  # or 'pusher' or 'supabase'
RATE_LIMIT_KV=memory      # or 'redis' or 'upstash'
```

### Cron Setup
```bash
# Every 10 minutes
*/10 * * * * node scripts/cron/turnTimeout.ts

# Daily at 3am
0 3 * * * node scripts/cron/reputationBackfill.ts
```

---

## Testing

**Security:**
- Verify headers in response
- Test CSRF protection
- Verify rate limits

**Performance:**
- Check SQL indices are used
- Monitor query times
- Verify cache hit rates

**Cron:**
- Run jobs manually
- Verify events emitted
- Check point recalculation

---

## Next Steps

1. **Auth Integration** — Replace `x-demo-auth` with real auth
2. **Database** — Migrate from file system to SQL
3. **Realtime** — Connect Pusher/Supabase
4. **Monitoring** — Add observability layer

