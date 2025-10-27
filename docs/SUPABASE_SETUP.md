# Supabase Setup for Glyphd

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project named "Glyphd"
3. Wait for project to be provisioned (~2 minutes)

## 2. Run Database Schema

In Supabase Dashboard → SQL Editor:

1. Copy contents of `supabase/schema.sql`
2. Paste into SQL Editor
3. Click "Run"

This creates:
- `profiles` table
- `marks` table (main content)
- `mark_sections` for content sections
- `mark_files` for assets
- Feed tables (`feed_likes`, `feed_comments`)
- Collaboration tables
- Row Level Security policies

## 3. Connect to Vercel

When deploying to Vercel:

1. Vercel will auto-detect Supabase if configured in Supabase Dashboard → Settings → Integrations
2. Or manually add in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Local Environment

Copy `.env.local.example` to `.env.local` and fill in values:

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Get keys from Supabase Dashboard → Settings → API

## 5. Migration from File Storage

The app now uses:
- **Database**: Marks, users, interactions
- **File System**: Temporary storage for images (still uses `public/symbols/`)

For production, consider:
- Storing images in Supabase Storage
- Or keeping current file-based image storage

## 6. Authentication

Supabase handles:
- User signup/signin
- Email verification
- Password reset
- Social auth (Google, GitHub, etc.)

Auth middleware is in `apps/web/middleware.ts` (currently disabled for demo).

## Next Steps

1. Run schema in Supabase
2. Update Vercel env vars
3. Test auth flow
4. Migrate existing file data to database (optional)


