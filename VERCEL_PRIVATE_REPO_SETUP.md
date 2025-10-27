# Fix Vercel Deployment with Private GitHub Repo

## Issue
Your repository is private on GitHub, so Vercel needs proper permissions to access and deploy it.

## Solution Options

### Option 1: Make Repository Public (Easiest)

1. Go to your GitHub repo: `https://github.com/bohselecta/glyphd-com`
2. Click "Settings" tab
3. Scroll to bottom → "Danger Zone"
4. Click "Change visibility"
5. Select "Make public"
6. Confirm

Vercel will then have full access to the repo for deployments.

---

### Option 2: Keep Private & Configure GitHub Permissions

If you want to keep the repo private:

1. **Grant Vercel GitHub Access:**
   - Go to Vercel Dashboard → Settings → Git
   - Disconnect the current integration
   - Reconnect and authorize Vercel
   - Make sure Vercel has access to private repos

2. **Configure GitHub App Permissions:**
   - Go to GitHub Settings → Applications
   - Find "Vercel" app
   - Click "Configure"
   - Enable access to private repos
   - Save

3. **Redeploy:**
   - Go back to your Vercel project
   - Click "Redeploy" on latest deployment

---

### Option 3: Vercel CLI Deployment (Alternative)

If you want to deploy without making repo public:

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to your project
cd apps/web

# Link to existing project
vercel link

# Deploy
vercel --prod
```

This uses your local GitHub credentials to access the private repo.

---

## Recommended Path

For simplicity and fastest deployment:

1. **Make repo public** (for now)
2. **Vercel will auto-redeploy**
3. **Verify it works**
4. **Optionally make private again later** if needed

---

## Check Deployment Status

After making repo public:

1. Go to Vercel Dashboard
2. Check "Deployments" tab
3. Wait for auto-redeploy to trigger
4. Look for new deployment with green checkmark
5. Click deployment to view logs
6. Visit your deployment URL

---

## Next Steps After Success

Once deployment works:

1. Set environment variables in Vercel
2. Configure Supabase
3. Test the app
4. Enable production auth when ready

**Repository status:** Private → Blocking Vercel access  
**Solution:** Make public or grant Vercel GitHub access

