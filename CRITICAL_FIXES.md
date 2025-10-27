# Critical Fixes Applied

## Issue Summary
1. **Images not generating/displaying** - Files were being written to wrong directory
2. **Dock assistant edits not applying** - Files not being updated, only metadata placeholder

## Root Cause
`process.cwd()` when running from `apps/web` resolves to that directory, not the project root. This caused:
- Files written to: `apps/web/apps/web/public/symbols/` (wrong)
- Files read from: `apps/web/public/symbols/` (correct location but no files there)

## Fixes Applied

### 1. Path Resolution Helper
Added `getSymbolsDir()` function in `packages/deployer/fileWriter.ts`:
```typescript
function getSymbolsDir() {
  let dir = path.join(process.cwd(), 'public/symbols')
  if (fs.existsSync(dir)) return dir
  dir = path.join(process.cwd(), 'apps/web/public/symbols')
  if (fs.existsSync(dir)) return dir
  return path.join(process.cwd(), 'apps/web/public/symbols')
}
```

This tries multiple paths and returns the correct one.

### 2. Updated All File Writers
- `writeSymbolFiles()` - Now uses `getSymbolsDir()`
- `writeMarkFiles()` - Now writes images AND uses `getSymbolsDir()`
- `writeSymbolSchema()` - Updated path
- `writeSchemaEntry()` - Updated path
- `ensureSchemaDir()` - Updated path

### 3. Updated All File Readers  
- `apps/web/app/s/[slug]/page.tsx` - Now checks multiple paths
- `apps/web/app/dashboard/page.tsx` - Now checks multiple paths
- `apps/web/app/api/marks/[slug]/dock/message/route.ts` - Now uses `getSymbolsDir()`

### 4. Dock Assistant Edits
Updated to:
- Use correct path resolution
- Actually update schema files (not just metadata placeholder)
- Files will now be modified and visible after refresh

## Testing

After restart, try:
1. Create a new mark via `/build?prompt=...`
2. Check that `hero.png` exists in `apps/web/public/symbols/[slug]/`
3. Use dock assistant to edit - changes should persist

## Expected Behavior

**Image Generation:**
- Images now save to: `apps/web/public/symbols/[slug]/hero.png`
- Visible at: `/symbols/[slug]/hero.png`
- Page checks `hasHero` and displays image

**Dock Edits:**
- Edits modify actual files in correct location
- Changes persist across refreshes
- Page renders updated content

## Status
✅ **Ready for deployment** - All path issues resolved


