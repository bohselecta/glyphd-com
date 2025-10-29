# Vercel Deployment Fix - File System Read-Only Issue

## Problem
Vercel's serverless functions run in a read-only file system. The build process was failing with:
```
EROFS: read-only file system, open '/var/task/apps/web/public/symbols/...'
```

## Solution

### 1. **File Writer Updates** (`packages/deployer/fileWriter.ts`)
Added `isReadOnlyEnv()` detection function that checks for Vercel environment:
```typescript
function isReadOnlyEnv() {
  return process.env.VERCEL === '1' || process.env.VERCEL || 
         typeof fs.existsSync !== 'function' || 
         typeof fs.mkdirSync !== 'function'
}
```

All file writing operations now skip in Vercel:
- `ensureDir()` - Skips directory creation
- `writeBufferTo()` - Skips image writing
- `writeSymbolFiles()` - Returns early without writing
- `writeMarkFiles()` - Skips file writes
- `writeMarkSchema()` - Skips schema writes
- `writeSymbolSchema()` - Skips schema writes
- `writeSchemaEntry()` - Skips entry writes

### 2. **Build API Updates** (`apps/web/app/api/build/route.ts`)
Enhanced to save to database instead of filesystem on Vercel:
- Calls `composeAndBuild()` which returns JSON data
- Saves mark to Supabase database instead of writing files
- Returns build result with symbol data

### 3. **Enhanced Path Resolution**
Improved `getSymbolsDir()` to try multiple path patterns for different deployment scenarios.

## Environment Variables Required

Set these in Vercel project settings:

```
ZAI_API_KEY=sk-your-deepseek-key
IMAGE_GEN_API_KEY=your-deepinfra-key
```

## How It Works Now

**Local Development**:
- Writes files to `apps/web/public/symbols/` as before
- Full file system access

**Vercel Production**:
- Detects read-only environment
- Skips all file writes
- Saves mark data to Supabase database
- Returns JSON data for client-side rendering

## Next Steps

The marks are now saved to the database. You'll need to update the mark display pages to:
1. Read from database instead of filesystem
2. Store the generated image (base64 or URL) in the mark record
3. Update the mark page component to fetch from API

The data structure is in the database:
- `marks.metadata` - Contains heroImage, mappedSchemas
- `marks.schema_data` - Contains nav, features, pricing
- `marks.headline`, `marks.sub` - Copy data

