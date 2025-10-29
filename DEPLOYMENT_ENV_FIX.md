# Deployment Environment Variables Fix

## Issue
Your Vercel deployment is using the old z.ai API endpoint because it has `ZAI_BASE_URL` set to `https://api.z.ai` in environment variables.

The error shows:
```
Failed to parse URL from https://api.z.ai (default)/v1/chat/completions
```

This means the deployment has the old URL but is trying to use the new DeepSeek endpoint path.

## Solution: Update Vercel Environment Variables

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com
2. Go to your project
3. Click **Settings** → **Environment Variables**

### Step 2: Update ZAI_BASE_URL
Change this variable:
- **Key**: `ZAI_BASE_URL`
- **Value**: Change from `https://api.z.ai` to `https://api.deepseek.com`
- Or **DELETE** it entirely (it will use the default from code)

### Step 3: Update ZAI_API_KEY
Make sure your DeepSeek API key is set:
- **Key**: `ZAI_API_KEY`
- **Value**: Your DeepSeek API key (starts with `sk-`)

**Delete the old z.ai key** if it's still there.

### Step 4: Redeploy
After updating environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for it to complete

## Complete Environment Variables List

Here's what should be set in Vercel:

```bash
# DeepSeek API (REQUIRED)
ZAI_API_KEY=sk-your-deepseek-api-key-here

# Image Generation (REQUIRED)
IMAGE_GEN_API_KEY=your-deepinfra-api-key-here

# Optional: Custom API endpoint (only if different from defaults)
# ZAI_BASE_URL=https://api.deepseek.com  # Can delete this
# ZAI_CHAT_PATH=/v1/chat/completions     # Can delete this

# Optional: Supabase (if using auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Public URL
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

## Verification

After redeploying, test the build by:
1. Going to your Vercel deployment URL
2. Enter an idea (e.g., "A coffee shop landing page")
3. Click "Make"
4. It should now use DeepSeek API correctly

## Common Issues

### "Failed to parse URL"
- **Cause**: Old `ZAI_BASE_URL` environment variable
- **Fix**: Update or delete `ZAI_BASE_URL` in Vercel settings

### "Authentication Fails"
- **Cause**: Wrong API key or missing DeepSeek key
- **Fix**: Update `ZAI_API_KEY` to your DeepSeek key

### "Build stuck at 10%"
- **Cause**: Missing or incorrect API keys
- **Fix**: Check all environment variables are set correctly

## Testing Locally

To test with the correct configuration locally, your `keys/keys.json` should be:

```json
{
  "ZAI_API_KEY": "sk-your-deepseek-api-key",
  "IMAGE_GEN_API_KEY": "your-deepinfra-api-key"
}
```

Then test:
```bash
curl -s http://localhost:5173/api/build -X POST -H "Content-Type: application/json" -d '{"prompt":"test","symbol":"test","stream":false}' | jq '.symbol.slug'
```

This should return a slug name if working correctly.

