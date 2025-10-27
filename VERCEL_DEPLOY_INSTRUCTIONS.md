# Vercel Deployment Instructions

## 🚀 Quick Deployment Steps

### 1. Configure Project Settings in Vercel Dashboard

Go to your Vercel project → Settings → General:

**Root Directory:** `apps/web`

**Framework Preset:** Next.js

**Build Command:** (leave default - `npm run build`)
   
**Output Directory:** `.next`

**Install Command:** (leave default - `npm install`)

---

## 2. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
ZAI_API_KEY=your-zai-key
IMAGE_GEN_API_KEY=your-image-gen-key
```

### How to get Supabase credentials:
1. Go to your Supabase project
2. Settings → API
3. Copy "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### How to get API keys:
- **ZAI_API_KEY**: From Z.ai dashboard
- **IMAGE_GEN_API_KEY**: From DeepInfra dashboard

---

## 3. Apply Changes

After setting root directory to `apps/web`:
1. Go to Deployments tab
2. Click "Redeploy" on latest deployment
3. Wait for build to complete

---

## 4. Enable Authentication (Production)

Once deployed and tested:

Edit `apps/web/middleware.ts` line 82:

```typescript
// Change from:
const requireAuth = false

// To:
const requireAuth = true
```

Then commit and push:

```bash
git add apps/web/middleware.ts
git commit -m "Enable authentication for production"
git push origin main
```

---

## 5. Configure Supabase

### Run SQL Schema:
1. Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Paste and Run

### Configure Auth Redirect URLs:
1. Settings → Authentication → URL Configuration
2. Add redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app`
3. Save

### Enable Email Auth:
1. Settings → Authentication → Providers
2. Enable "Email"
3. Configure email templates (optional)

---

## 6. Test Deployment

### Visit your deployed app:
```
https://your-app.vercel.app
```

### Test Auth Flow:
1. Go to `/login`
2. Enter email
3. Check email for magic link
4. Click link to sign in

### Verify Routes:
- `/` - Homepage
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Dashboard (auth required)
- `/feed` - Feed
- `/pricing` - Pricing

---

## 7. (Optional) Migrate Existing Data

If you have file-based marks that need to be migrated to database:

```bash
# Run migration locally first to test
cd apps/web
npm run migrate

# Or set environment variables in Vercel CLI:
vercel env pull

# Then run migration
npm run migrate
```

---

## Troubleshooting

### Build Fails with "Cannot find module"
- Ensure `apps/web` is set as Root Directory
- Check that `node_modules` is being installed
- Verify dependencies in `apps/web/package.json`

### Build Too Fast (no files generated)
- Root directory not set correctly
- Check Vercel logs for error messages
- Verify `vercel.json` is at root level

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side
- Check Vercel environment variable settings
- Restart deployment after adding variables

### Auth Not Working
- Check Supabase redirect URLs
- Verify environment variables are set
- Check browser console for errors
- Ensure `NEXT_PUBLIC_SUPABASE_URL` is correct

### 404 on All Routes
- Root directory must be `apps/web`
- Rebuild deployment after changing settings

---

## Current Status

✅ Code pushed to GitHub  
✅ Auth system implemented  
✅ Supabase integration complete  
✅ Real-time features connected  
⏳ Waiting for Vercel configuration  
⏳ Awaiting environment variables  
⏳ Awaiting Supabase schema deployment  

---

## Next Steps

1. **Configure Vercel:**
   - Set root directory to `apps/web`
   - Add environment variables
   - Trigger redeploy

2. **Set up Supabase:**
   - Run SQL schema
   - Configure auth redirects
   - Enable email auth

3. **Test & Launch:**
   - Test auth flow
   - Verify all routes
   - Enable production auth

---

**Deployment URL:** Will be available in Vercel dashboard after successful deployment.

