# Supabase Integration Complete

## What's Been Set Up

### 1. Database Schema (`supabase/schema.sql`)
- **profiles** - User profiles extending Supabase auth
- **marks** - Main content (your marks/symbols)
- **mark_sections** - Content sections (features, pricing, etc.)
- **mark_files** - Images and assets
- **feed_likes**, **feed_comments** - Social interactions
- **collab_requests**, **collab_sessions** - Collaboration features

Full Row Level Security policies for data protection.

### 2. Supabase Client Setup
- `apps/web/lib/supabase/client.ts` - Browser client
- `apps/web/lib/supabase/server.ts` - Server client
- `apps/web/lib/database.ts` - Database operations

### 3. Auth Routes
- `apps/web/app/api/auth/callback/route.ts` - OAuth callback
- `apps/web/app/api/auth/signup/route.ts` - Signup
- `apps/web/app/api/auth/login/route.ts` - Login

### 4. Installed Packages
```json
"@supabase/supabase-js": "latest"
"@supabase/ssr": "latest"
```

## Next Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create project "Glyphd"
3. Wait for provisioning

### 2. Run Schema
In Supabase Dashboard → SQL Editor:
```sql
-- Copy and paste contents of supabase/schema.sql
-- Click "Run"
```

### 3. Connect Vercel
When deploying to Vercel:

**Option A: Auto (Recommended)**
- Supabase Dashboard → Settings → Integrations → Vercel
- Connect and deploy

**Option B: Manual**
- Get keys from Supabase → Settings → API
- Add to Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
```

### 4. Update Your Build Routes

You'll need to update these to use Supabase instead of file system:
- `apps/web/app/api/build/route.ts` - Save marks to database
- `apps/web/app/api/feed/route.ts` - Query marks from database  
- `apps/web/app/dashboard/page.tsx` - Load from database

Current file-based approach still works for images:
- Images still save to `public/symbols/[slug]/hero.png`
- Database stores metadata and path references

## Local Testing

```bash
# Create .env.local
cd apps/web
cp .env.local.example .env.local

# Add your Supabase keys to .env.local
# Then start dev server
npm run dev
```

## Migration Strategy

### Phase 1: Dual Mode (Current)
- New marks saved to both file system AND database
- Read from database preferentially
- Fallback to file system for existing data

### Phase 2: Database Only
- All reads/writes through Supabase
- Images in Supabase Storage or keep file system

### Phase 3: Full Migration
- Move existing files to database
- Update all routes to database-only

## Benefits

✅ **Authentication** - Real user accounts
✅ **Database** - Structured, queryable data
✅ **RLS** - Row Level Security built-in
✅ **Realtime** - Can add realtime subscriptions
✅ **Storage** - For images (optional)
✅ **Triggers** - Auto-update timestamps, etc.

## Files Modified

### New Files
- `apps/web/lib/supabase/client.ts`
- `apps/web/lib/supabase/server.ts`
- `apps/web/lib/database.ts`
- `supabase/schema.sql`
- `apps/web/app/api/auth/*` routes
- `docs/SUPABASE_SETUP.md`

### Existing Files (Keep as is for now)
- All other API routes still use file system
- Will migrate incrementally

## Ready for Deployment

1. Create Supabase project "Glyphd"
2. Run the schema
3. Deploy to Vercel
4. Connect Supabase integration
5. Add env vars if needed

The app will work in dual mode until you migrate all routes to Supabase.


