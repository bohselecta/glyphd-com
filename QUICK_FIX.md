# Quick Deployment Fix

## The Problem
- Your code is fine
- Vercel can't access your private GitHub repo
- Root directory not configured in Vercel

## The Fix (3 Steps, 2 Minutes)

### 1. Make Repo Public
```
1. Go to: https://github.com/bohselecta/glyphd-com
2. Click "Settings"
3. Scroll to "Danger Zone"
4. Click "Change visibility" → "Make public"
5. Type repository name to confirm
```

### 2. Configure Vercel
```
1. Go to your Vercel project
2. Settings → General
3. Scroll to "Build & Development Settings"
4. Click "Edit" on "Root Directory"
5. Enter: apps/web
6. Save
```

### 3. Add Environment Variables (Optional for now)
```
Settings → Environment Variables → Add:
- IMAGE_GEN_API_KEY: (from keys.json)
- ZAI_API_KEY: (from keys.json)
```

### 4. Redeploy
```
Deployments tab → Latest deployment → "..." → "Redeploy"
```

**Done. It will work.**

---

## Why This Fixes It

- **Private repo** → Vercel can't clone it
- **Wrong root** → Vercel doesn't know where Next.js app is
- **Make public + set root** → Vercel can deploy

Your code is already there. This is just permissions/config.
