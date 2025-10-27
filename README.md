# Glyphd — Make Your Mark

AI-powered symbol builder for creative apps, brands, and products.

## Quick Start

```bash
# Install dependencies
cd apps/web
npm install

# Run locally
npm run dev

# Visit http://localhost:5173
```

## Deployment to Vercel

### Requirements
- Node.js 18+ 
- Vercel account

### Setup Steps

1. **Clone repository**
```bash
git clone https://github.com/bohselecta/glyphd-com.git
cd glyphd-com
```

2. **Install dependencies**
```bash
cd apps/web
npm install
```

3. **Configure Vercel**
   - Connect GitHub repo to Vercel
   - **Set Root Directory:** `apps/web`
   - Add environment variables:
     - `IMAGE_GEN_API_KEY`
     - `ZAI_API_KEY`
     - `NEXT_PUBLIC_SUPABASE_URL` (optional)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)

4. **Deploy**
   - Vercel will auto-deploy on push
   - Or click "Deploy" in dashboard

## Project Structure

```
glyphd-com/
├── apps/
│   └── web/          # Next.js app (deploy this)
├── packages/         # Shared modules
│   ├── ai/          # AI integration
│   ├── core/        # Builder engine
│   └── deployer/    # File writer
├── scripts/          # Utilities
└── supabase/        # Database schema

```

## Features

- **Demo Mode** - Test without database setup
- **Auth** - Supabase magic link authentication
- **Builder** - AI-powered mark generation
- **Feed** - Community showcase
- **Real-time** - Collaboration features

## Environment Variables

For local development, create `apps/web/keys/keys.json`:

```json
{
  "IMAGE_GEN_API_KEY": "your-deepinfra-key",
  "ZAI_API_KEY": "your-zai-key"
}
```

For production on Vercel, add these in dashboard:
- `IMAGE_GEN_API_KEY` - DeepInfra API key
- `ZAI_API_KEY` - Z.ai API key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

## Documentation

- [Setup Guide](./SETUP.md)
- [Deployment](./DEPLOYMENT.md)
- [Demo Mode](./DEMO_MODE.md)
- [Auth Setup](./SUPABASE_AUTH_SETUP.md)

## License

Private
