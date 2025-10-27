# 🧩 Glyphd — Phase 4: Builder Network

> **Connect. Collaborate. Create.**

This document describes the social and collaboration features added to Glyphd as part of Phase 4.

---

## 🌐 Overview

The Builder Network transforms Glyphd from a single-player creative builder into a collaborative social platform for builders to showcase, iterate, and grow together.

---

## ✨ Features Implemented

### 1. Feed System (`/feed`)

A public feed of shared Marks with filtering capabilities.

- **Filters:** New, Trending, Featured
- **Actions:** Like, Comment, Request Collaboration
- **Real-time updates** via API
- **Infinite scroll** support

**File:** `apps/web/app/feed/page.tsx`

### 2. User Profiles (`/u/[username]/`)

Individual profile pages showing:
- Avatar, bio, reputation score
- Total marks and stats
- Gallery of user's creations
- Collaboration history
- Liked marks collection

**File:** `apps/web/app/u/[username]/page.tsx`

### 3. Builder Points System

Track and reward builder activity:

| Event                  | Points | Triggers                         |
| ---------------------- | ------ | -------------------------------- |
| Mark liked             | +1     | Someone likes their Mark         |
| Helpful comment        | +0.5   | Someone comments on their Mark  |
| Collaboration accepted | +2     | Collaboration request accepted   |
| Round merged           | +3     | Collaborative edit is merged     |
| Mark featured          | +10    | Mark is featured by admins      |
| Collab abandoned       | -1     | User abandons a collaboration   |

**Files:**
- `packages/core/builder_points.ts`
- `apps/web/app/api/builder/points/route.ts` (to be created)

---

## 🔧 API Routes

### Feed API (`/api/feed`)

**GET** - Fetch Marks with filtering:
```typescript
GET /api/feed?filter=trending&limit=20
// Returns: { ok: true, marks: FeedMark[], total: number }
```

**POST** - Interact with a Mark:
```typescript
POST /api/feed
// Body: { markSlug: string, action: 'like'|'comment'|'collab', value: number }
// Updates metadata.json with engagement stats
```

### Builder Points (`/api/builder/points`)

Track and retrieve builder reputation:
- `GET /api/builder/points/[username]` - Get user's points
- `POST /api/builder/points` - Award points for an event

---

## 📊 Data Models

### FeedMark
```typescript
interface FeedMark {
  id: string
  title: string
  author: string
  description: string
  likes: number
  comments: number
  collabRequests: number
  createdAt: string
  heroImage: string
  slug: string
}
```

### BuilderPoints
```typescript
interface BuilderPoints {
  username: string
  points: number
  likes: number
  comments: number
  merges: number
  acceptedCollabs: number
  featured: number
  abandoned: number
  lastUpdated: string
}
```

---

## 🎨 UI Components

### Enhanced ShareButton

Now includes "Post to Feed" functionality:
- Copy share link
- Post Mark to public feed
- Visual feedback on success

**File:** `apps/web/components/ShareButton.tsx`

---

## 🚀 Usage

### Publishing to Feed

1. Build a Mark
2. Open Mark preview page
3. Click "Post to Feed" in Share button group
4. Mark appears in `/feed` with your username

### Viewing Feed

Navigate to `/feed` to see:
- All public Marks (by default sorted by newest)
- Filters: New, Trending, Featured
- Engagement stats (likes, comments, collab requests)
- Quick actions to interact

### User Profiles

Visit `/u/[username]` to see:
- Builder reputation score
- Total marks created
- Likes given and received
- Collaborations accepted
- Featured marks count

---

## 🔐 Privacy

- **Private marks** remain hidden from feed (check `metadata.json` for `private: true`)
- Only public marks appear in `/feed`
- User data includes only: username, stats, public marks
- No personal data exposed

---

## 🛠️ Future Enhancements

1. **Collaboration Workspace** (`/collab/[slug]/`)
   - Turn-based editing
   - Live diff viewer
   - Vote-to-merge system

2. **Comments System**
   - Threaded comments per Mark
   - Real-time updates
   - Comment reactions

3. **Following System**
   - Follow builders
   - Personalized feed
   - Activity notifications

4. **Marketer Roles**
   - Special badges for top builders
   - Featured section curation
   - Platform ambassador status

---

## 📁 File Structure

```
apps/web/
├── app/
│   ├── feed/
│   │   └── page.tsx          # Feed UI
│   ├── u/[username]/
│   │   └── page.tsx           # Profile UI
│   └── api/
│       ├── feed/
│       │   └── route.ts       # Feed API
│       └── builder/
│           └── points/         # Points API (todo)
├── components/
│   └── ShareButton.tsx        # Enhanced sharing
└── public/
    └── builders/               # Builder data storage
packages/core/
└── builder_points.ts          # Points logic
```

---

## ✅ Implementation Status

- [x] Feed API routes created
- [x] Feed page UI implemented
- [x] User profile page created
- [x] Builder points system added
- [x] Share button enhanced with "Post to Feed"
- [x] Navigation updated with Feed link
- [ ] Collaboration workspace (Phase 4.5)
- [ ] Comments UI (Phase 4.5)
- [ ] Following system (Phase 5)
- [ ] Database integration (Phase 5)

---

## 🎯 Outcome

**Glyphd is now a social builder platform.**

Users can:
- ✅ Share their creations publicly
- ✅ Discover what others are building
- ✅ Build reputation through engagement
- ✅ Show off their portfolio
- ⏳ Collaborate on projects (coming soon)

---

**Ready for Phase 4.5: Collaboration Workspace**

