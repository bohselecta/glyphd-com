# Vercel Deployment Guide

## Quick Deploy

### Option 1: Vercel CLI
```bash
npm i -g vercel
cd apps/web
vercel
```

### Option 2: GitHub + Vercel Dashboard
1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import repository
4. Configure:
   - Root Directory: `apps/web`
   - Framework: Next.js

## Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
IMAGE_GEN_API_KEY=9ZzUkgeqUZXZLC0ZRibcUkN8NZyTmyjH
ZAI_API_KEY=c8a73088afce45689a67bf2491fd112b.3Da1vaONCtsVbUpR
```

## Timeout Configuration

- **Image Generation**: 25 seconds (within 30s limit)
- **API Routes**: 30 seconds max (vercel.json configured)
- **Note**: Batch image generation (3 images) may still timeout. Test incrementally.

## Important Notes

### Middleware Auth Disabled
The auth middleware is disabled for demo deployment. It will allow all requests through without requiring the `x-demo-auth` header.

### Public Routes
The following routes are public and don't require authentication:
- `/` - Home page
- `/feed` - Community feed
- `/pricing` - Pricing page
- `/designer` - Designer console
- `/dashboard` - User dashboard
- `/marketplace` - Symbol marketplace
- `/signup` - Sign up
- `/login` - Login
- All `/api/*` routes listed in middleware

### Known Limitations
1. **30-second timeout** on free tier may cause issues with:
   - Batch image generation (logo + icon + OG image)
   - Multiple Z.ai API calls in sequence
   
2. **Solutions**:
   - Upgrade to Vercel Pro ($20/mo) for 120s timeout
   - Implement background jobs via Queue API
   - Use external image generation service with webhooks

## Testing Checklist

After deployment, test:
- [ ] Home page loads
- [ ] Create a symbol via `/` or `/designer`
- [ ] Image generation completes within 25 seconds
- [ ] Feed displays symbols
- [ ] Dashboard shows created symbols
- [ ] Share functionality works
- [ ] No 504 timeout errors

## Monitoring

Watch Vercel logs for:
- Timeout errors (504 status)
- Image generation failures
- API errors

## Demo URL Format

Your deployment will be available at:
`https://your-app-name.vercel.app`

Share this with Discord users for testing.

## Rollback Plan

If deployment fails:
1. Check Vercel function logs
2. Verify environment variables are set
3. Check timeout issues in dashboard
4. Consider reducing image generation to single hero image only
