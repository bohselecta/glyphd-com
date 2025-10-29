# Vercel Deployment Setup Guide

## Repository is Production-Ready ✅

All code has been pushed to GitHub and is ready for Vercel deployment.

## Re-Adding to Vercel

### Step 1: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub account
4. Find and select `bohselecta/glyphd-com`
5. Click "Import"

### Step 2: Configure Project

**Root Directory** (CRITICAL):
```
apps/web
```

**Framework Preset:**
```
Next.js
```

**Build Command:** (leave default or)
```
cd apps/web && npm run build
```

**Output Directory:** (leave default)
```
.next
```

**Install Command:** (leave default)
```
npm install
```

### Step 3: Environment Variables

Add these in the Environment Variables section:

```
IMAGE_GEN_API_KEY=your-deepinfra-api-key
ZAI_API_KEY=your-zai-glm-coding-plan-api-key
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

**Note:** 
- `IMAGE_GEN_API_KEY`: Get from [DeepInfra dashboard](https://deepinfra.com) - used for FLUX-1-dev image generation
- `ZAI_API_KEY`: Get from z.ai GLM Coding Plan dashboard - used for code generation and copy

**Optional** (if using Supabase):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Deploy

Click "Deploy" button. It should:
- ✅ Install dependencies
- ✅ Build from apps/web
- ✅ Deploy successfully

## What Gets Deployed

- Next.js app from `apps/web/`
- All API routes
- Static assets
- Public folder contents

## Verification

After deployment:
1. Visit your Vercel URL
2. Test login with demo mode
3. Try building a mark
4. Check feed, dashboard, etc.

## Troubleshooting

**If deployment fails:**
1. Check Root Directory is `apps/web`
2. Verify build logs for errors
3. Check environment variables are set
4. Try redeploying

**If gets HTML error:**
- API keys might be missing
- Check environment variables section

**If 404:**
- Root directory wrong
- Should be `apps/web` not `apps/web/`

## Status

✅ Code pushed to GitHub  
✅ Production ready  
✅ Root package.json added  
✅ README created  
✅ CI workflow added  
⏳ Waiting for Vercel import  

**Next step:** Import to Vercel with settings above.
