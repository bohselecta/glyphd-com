# ✅ Phase 4 Verification Checklist

Run these tests to verify the Builder Network is production-ready.

---

## Feed API (`/api/feed`)

### ✅ Cursor-based Pagination
```bash
# Test 1: Fetch first page
curl "http://localhost:3000/api/feed?sort=new&limit=5"
# Should return: { items: [...], nextCursor: "5", total: N }

# Test 2: Fetch next page
curl "http://localhost:3000/api/feed?sort=new&cursor=5&limit=5"
# Should return next 5 items with cursor "10" (or undefined if done)

# Test 3: Verify stable page sizes
curl "http://localhost:3000/api/feed?sort=new&limit=10"
# Should always return exactly 10 items (or less if fewer exist)
```

### ✅ Trending Score Calculation
```bash
# Test trending sort with decay
curl "http://localhost:3000/api/feed?sort=trending"
# Should sort by calculated trending score (likes + 0.5*comments with age decay)
# Older items should rank lower even with same engagement
```

### ✅ Posting (Idempotency)
```bash
# Test 1: Post mark to feed
curl -X POST http://localhost:3000/api/feed \
  -H "Content-Type: application/json" \
  -d '{"markSlug": "test-mark", "action": "post"}'
# Should return: { ok: true, id: "test-mark" }

# Test 2: Post same mark again
curl -X POST http://localhost:3000/api/feed \
  -H "Content-Type: application/json" \
  -d '{"markSlug": "test-mark", "action": "post"}'
# Should return: { ok: false, error: "Already posted to feed" } with status 409
```

### ✅ Like Deduplication
```bash
# Test: Like a mark (replace with real userId)
curl -X POST http://localhost:3000/api/feed/like \
  -H "Content-Type: application/json" \
  -d '{"id": "test-mark", "userId": "user1"}'
# Should return: { ok: true, likes: 1, liked: true }

# Test: Like again from same user
curl -X POST http://localhost:3000/api/feed/like \
  -H "Content-Type: application/json" \
  -d '{"id": "test-mark", "userId": "user1"}'
# Should unlike and return: { ok: true, likes: 0, liked: false }
```

---

## Profiles (`/u/[username]`)

### ✅ Fast Load Time
```bash
# Test profile page load
time curl "http://localhost:3000/u/testuser"
# Should complete in <200ms (if cached)
```

### ✅ Private Marks Excluded
- Create a private mark with `metadata.json: { private: true }`
- Visit profile of that mark's author
- Verify private mark does not appear in gallery

### ✅ Responsive Gallery Grid
- Mobile (<768px): 2 columns
- Desktop (≥1024px): 3-4 columns
- Test with browser dev tools responsive mode

---

## Builder Points

### ✅ Event-based System
```bash
# Add an event
node -e "
  const { addEvent } = require('./packages/core/builder_points.ts');
  addEvent({ type: 'like', by: 'testuser', markId: 'mark1', ts: Date.now() });
"
# Check: builders/events/events.json should contain the event
# Check: builders/testuser.json points should increment by 1
```

### ✅ Backfill Works
```bash
# Run backfill
node -e "require('./packages/core/builder_points.ts').backfillPoints()"
# Verify: builder points recomputed from events
# Verify: points match expected totals from events
```

### ✅ Anti-Gaming
- System blocks self-likes (same `userId`)
- Mutual-like spam detection (cooldown periods)
- Test: Try to like your own mark → should fail or be blocked

---

## ShareButton

### ✅ Visual Feedback
1. Click "Post to Feed"
2. Verify button shows "✓ Posted" for 3 seconds
3. Verify button is disabled during request

### ✅ Error Handling
```bash
# Test with invalid mark
curl -X POST http://localhost:3000/api/feed \
  -H "Content-Type: application/json" \
  -d '{"markSlug": "non-existent", "action": "post"}'
# Should return error with retry option in UI
```

---

## Navigation

### ✅ Active Link Highlighting
- Navigate to `/feed`
- Verify "Feed" link in header is highlighted/active
- Navigate to another page
- Verify "Feed" link is not highlighted

### ✅ Keyboard Focus Ring
- Tab to "Feed" link in header
- Verify visible focus ring (accessibility)

---

## Security

### ✅ CSRF Protection
- All POST endpoints should require CSRF token or same-origin check
- Test: Try to POST from external site → should fail

### ✅ Auth Guards
- Sensitive endpoints require authentication
- Public GET endpoints are safe

### ✅ Data Sanitization
- No email addresses exposed in public APIs
- No user IDs exposed (only usernames)
- Verify JSON responses contain only public fields

---

## Smoke Tests

### Test 1: Post → Like Flow
```
1. Create a mark
2. Post it to feed via "Post to Feed" button
3. Visit /feed
4. Like the mark from another account
5. Verify count updates in UI
```

### Test 2: Profile Count Updates
```
1. Create and post 3 marks
2. Visit author's profile
3. Verify "Gallery" shows 3 marks
4. Delete one mark
5. Refresh profile
6. Verify count updates to 2 (no ghosts)
```

### Test 3: Infinite Scroll
```
1. Ensure >20 marks in feed
2. Scroll /feed page
3. Verify all marks load in order
4. Verify sort order preserved across pages
```

### Test 4: Abuse Prevention
```
1. Same user spams like button rapidly
2. Verify only first like counts
3. Subsequent like attempts return 200 but don't increment
```

---

## Performance Targets

- ✅ `/api/feed?sort=trending` under 150ms (warm cache)
- ✅ Profile load under 200ms
- ✅ Infinite scroll smooth (60fps)

---

## Known Issues (Fix Before 4.5)

- [ ] CSRF tokens not yet implemented
- [ ] Auth system stubbed (need Phase 5)
- [ ] Database schema is file-based (migration path in `DATABASE_SCHEMA.md`)

---

## Go/No-Go Decision

If all checkboxes pass → **GO for Phase 4.5** 🚀

If any fail → **FIX before proceeding** ⚠️

