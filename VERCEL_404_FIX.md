# Fix Vercel 404 Error

## Issue
App deployed but returning 404 for all routes.

## Cause
Vercel is building from the wrong directory (repo root instead of `apps/web`).

## Solution

### Option 1: Set Root Directory in Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click "Settings" tab
   - Scroll to "Build & Development Settings"
   - Click "Edit" on "General"

2. **Set Root Directory**
   - Find "Root Directory" field
   - Click "Set" or "Override"
   - Enter: `apps/web`
   - Click "Save"

3. **Redeploy**
   - Go to "Deployments" tab
   - Find the latest deployment
   - Click "..." → "Redeploy"
   - Wait for build to complete

### Option 2: Use vercel.json in Each Project Directory

If Option 1 doesn't work, create a vercel.json that specifies the build settings:

**At the root of the repository**, create `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd apps/web && npm run build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs",
  "installCommand": "cd apps/web && npm install"
}
```

But actually, Vercel doesn't support specifying root directory in vercel.json anymore. You **must** use the dashboard.

### Option 3: Check Vercel Build Logs

1. Go to Vercel Dashboard
2. Click on your deployment
3. Check "Build Logs" tab
4. Look for:
   - "Build Output" section
   - Any errors or warnings
   - What directory it's building from

Expected output should show:
```
Building /vercel/path0 (apps/web)
```

### Option 4: Verify Build Output

Check if the build is producing outputs:

In build logs, look for:
```
✓ Build Complete
  ○ Static files: X files
  ○ Serverless Functions: X functions
  ○ Routes:
     - /api/* → serverless functions
     - /* → static files
```

If it shows "0 files", the root directory is not set correctly.

---

## Quick Verification Checklist

- [ ] Root Directory in Vercel settings is `apps/web`
- [ ] Environment variables are set (see below)
- [ ] Build logs show "Building /vercel/path0 (apps/web)"
- [ ] Build output shows routes being generated

---

## Required Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
ZAI_API_KEY=your-key
IMAGE_GEN_API_KEY=your-key
```

---

## If Still Getting 404

1. **Check the deployment URL:**
   - Are you visiting `https://your-project.vercel.app` (the project root)?
   - Or a specific branch/preview URL?

2. **Check build logs:**
   - Is there an error during build?
   - Are routes being generated?

3. **Try accessing the direct Next.js URL:**
   - Vercel creates URLs like: `https://glyphd-com-h8j5txyz.vercel.app`
   - Make sure you're using the primary domain

4. **Verify app is building correctly:**
   - Check that `apps/web/.next` directory is being created
   - Check that routes are listed in build output

---

## Temporary Workaround

If you need immediate deployment, consider:

1. **Move the Next.js app to repo root** (not recommended but quick)
2. **Use a different hosting** (Netlify, Railway, etc.)
3. **Wait for Vercel to fix their dashboard** (sometimes it takes a few minutes to update)

---

## Most Likely Issue

Based on the error, Vercel is probably:
- Building from repo root instead of `apps/web`
- Not finding the Next.js app
- Producing an empty build (0 routes)

**Solution:** Set Root Directory in dashboard to `apps/web`

