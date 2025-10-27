# Glyphd Setup Guide

## Quick Start

```bash
cd apps/web
npm install
npm run dev
```

Visit http://localhost:5173

## Configuration

### API Keys

1. Copy the example keys file:
```bash
cp keys/keys.json.example keys/keys.json
```

2. Edit `keys/keys.json` with your API credentials:
   - **ZAI_API_KEY**: Z.ai API key for text generation
   - **IMAGE_GEN_API_KEY**: DeepInfra API key for image generation

### Setting Keys via UI

You can also configure keys through the UI at `/settings/keys`.

## Usage

### Creating a Symbol

1. Go to the main page `/`
2. Enter a prompt describing your idea (e.g., "An e-commerce page for a neon desert jacket")
3. Choose image model and size
4. Click "Glyph It" to generate

### Configuring Schemas

1. Open your created Symbol at `/s/[slug]`
2. Click "Configure" in the navigation
3. Select a schema type from the dropdown
4. Edit the fields and save

### Viewing & Managing Symbols

Symbols are immediately available within Glyphd:
- View at `/s/[slug]` - Live preview with full JSON-LD injection
- Edit metadata at `/s/[slug]/edit`
- Configure schemas at `/s/[slug]/configure`  
- Generate additional assets via the asset generator

## Troubleshooting

### Build fails with "Symbol not found"
- Ensure `/apps/web/public/symbols/` directory exists
- Check that Symbol was created successfully in the build logs

### API key errors
- Verify keys are set in `keys/keys.json`
- Check that API keys are valid and have proper permissions
- Some features may work without all keys (e.g., viewing Symbols doesn't need API keys)

### Image generation fails
- Verify DeepInfra API key is valid
- Check API quota/rate limits
- Try different image models or sizes

## Architecture

- **`/apps/web`**: Next.js web application
- **`/packages/core`**: Builder engine and orchestration
- **`/packages/deployer`**: File writing and deployment utilities
- **`/packages/designer`**: Intent mapping and schema suggestions
- **`/packages/schemas`**: Schema registry and JSON-LD generation
- **`/packages/ai`**: Z.ai and DeepInfra integration

## Development

### Running Locally
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Testing the Pipeline

1. Create a test Symbol with a simple prompt
2. Verify files are created in `/public/symbols/[slug]/`
3. Check that schema templates exist in `/public/symbols/[slug]/schemas/`
4. View the Symbol page to see JSON-LD injection
5. Test the configure UI to edit schema data
