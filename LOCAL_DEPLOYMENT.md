# Local Deployment Setup & Vercel Configuration

## Current Status
✅ Dev server running on http://localhost:5173
✅ Image generation timeout optimized for Vercel 30s limit (reduced from 60s to 25s)
✅ Timeout-optimized configuration added

## Changes Made

### 1. Image Generation Timeout (`packages/ai/imageGen.ts`)
- **Before**: 60 second timeout
- **After**: 25 second timeout (within Vercel's 30s free tier limit)
- Ensures operations complete before hitting platform limits

### 2. Next.js Configuration (`apps/web/next.config.js`)
- Added experimental config for better resource management
- Maintains webpack aliases for monorepo structure

### 3. Vercel Configuration (`apps/web/vercel.json`)
- Set max duration to 30 seconds for all API routes
- Ensures consistent behavior across deployment

## Local Testing

```bash
# Already running - check at:
http://localhost:5173
```

### Test Endpoints
1. **Homepage**: `/` - Main builder interface
2. **Feed**: `/feed` - Community feed
3. **Designer**: `/designer` - Schema mapping
4. **Dashboard**: `/dashboard` - User gallery

### Key API Routes to Test
- `POST /api/build` - Symbol building (uses image gen with new timeout)
- `POST /api/assets/generate` - Asset generation (3 images, ~75s total with old timeout)
- `POST /api/marks/[slug]/dock/message` - AI chat with Z.ai
- `GET /api/feed` - Feed listing

## Vercel Deployment Prep

### Environment Variables Needed
```bash
ZAI_API_KEY=your-zai-key
IMAGE_GEN_API_KEY=your-deepinfra-key
VERCEL_TOKEN=your-vercel-token
```

### Deployment Steps

1. **Connect Repository to Vercel**
   - Go to vercel.com/new
   - Import this repository
   - Set root directory to: `apps/web`

2. **Configure Environment Variables**
   - Add all required keys in Vercel dashboard
   - Settings → Environment Variables

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Timeout Behavior
- **Free Tier**: 30 second max duration
- **Image Gen**: 25 second timeout (safely under limit)
- **Multiple Images**: Sequential generation in `/api/assets/generate` route may still timeout
- **Recommendation**: Test with single hero image first, then optimize for batch generation

## Potential Issues & Solutions

### Issue: Image generation timeout on Vercel
**Symptoms**: Timeout errors when generating images
**Solutions**:
1. Use single hero image instead of batch (logo, icon, og)
2. Consider upgrading to Vercel Pro (120s timeout)
3. Implement image caching/CDN for generated assets
4. Move image generation to background jobs (functions)

### Issue: Cold starts
**Symptoms**: Slow first request
**Solutions**:
1. Enable Edge Functions for faster response
2. Use ISR (Incremental Static Regeneration)
3. Implement proper caching headers

### Issue: Middleware auth blocking
**Check**: Middleware requires `x-demo-auth` header for non-public routes
**Solution**: Disable or configure auth for demo deployment

## Testing Checklist

- [ ] Home page loads
- [ ] API routes respond within 30s
- [ ] Image generation completes
- [ ] Feed displays
- [ ] Designer console works
- [ ] Symbol creation succeeds
- [ ] Share functionality works
- [ ] No console errors

## Next Steps
1. Test locally for remaining issues
2. Configure Vercel project
3. Deploy to production
4. Share demo with Discord users
5. Monitor for timeout issues
6. Optimize based on feedback

---

**Note**: The 30-second limit on Vercel free tier may be challenging for image generation. Consider:
- Upgrading to Pro (120s)
- Implementing background job system
- Using external image generation service with webhooks
