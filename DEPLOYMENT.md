# Glyphd Deployment Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys for Z.ai and DeepInfra (image generation)

## Environment Variables

Create a `.env.local` file in `apps/web/`:

```bash
# Required: Z.ai API Key
ZAI_API_KEY=your_zai_api_key_here

# Required: DeepInfra API Key
IMAGE_GEN_API_KEY=your_deepinfra_api_key_here

# Optional: Stripe (for pricing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_PRICE_CREATOR_MONTHLY=price_...
NEXT_PUBLIC_PRICE_CREATOR_QUARTERLY=price_...
STRIPE_TAX_FEATURE=on
STRIPE_CHARGEBACK_PROTECTION=on

# Optional: Public URL
PUBLIC_BASE_URL=https://glyphd.com
```

## Local Development

```bash
# Install dependencies
cd apps/web
npm install

# Run development server
npm run dev

# App will be available at http://localhost:5173
```

## Deployment Options

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel dashboard
3. Add environment variables in Vercel settings
4. Deploy

Vercel will auto-detect Next.js and build accordingly.

### Docker

```bash
# Build Docker image
docker build -t glyphd .

# Run container
docker run -p 3000:3000 --env-file .env.local glyphd
```

### Manual

```bash
# Build
npm run build

# Start production server
npm start
```

## Features

- **Builder Engine**: AI-powered mark generation
- **Image Generation**: DeepInfra FLUX integration
- **Schema System**: Structured data with JSON-LD
- **Edit Dock**: AI-powered editing interface
- **Gallery**: Browse created marks
- **Pricing Tiers**: Free and Creator plans with Stripe

## Troubleshooting

### API Key Issues
- Ensure keys are correctly set in `apps/web/.env.local`
- Check that keys have proper permissions

### Build Errors
- Clear `.next` folder and rebuild
- Check Node.js version (18+)

### Image Generation Timeout
- Default timeout is 60 seconds
- Check DeepInfra API status
- Verify API key is valid

## Support

For issues or questions, see:
- `/docs/` directory for detailed documentation
- API integration: `docs/api-integration.md`
- Architecture: `docs/architecture.md`

