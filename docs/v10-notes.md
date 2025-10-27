# v10 Notes

- Introduces **Marks** (/m routes), share links, refine API, schema explain, critique API
- Includes key loader util and path aliases
- Minimal stubbed builder suitable for Cursor to flesh out

## Changes from v9

### Naming
- **Symbols** → **Marks** (more personal, memorable)
- Routes moved from `/s/[slug]` to `/m/[slug]` (maintained backward compatibility)

### New Features
1. **Share System** (`/api/share/[slug]`)
   - Makes Marks publicly accessible
   - Generates shareable links
   - Sets `public` flag and `sharedAt` timestamp

2. **Refine API** (`/api/marks/[slug]/refine`)
   - Iterative refinement chat
   - Natural language edits to Mark content
   - Stub implementation ready for AI enhancement

3. **Critique API** (`/api/critique`)
   - AI-powered feedback on UX, accessibility, SEO
   - Severity levels and quick fixes
   - Ready for integration with z.ai

4. **Schema Explain** (`/api/schema/explain`)
   - Explains schema types in plain English
   - Shows SERP preview mockups
   - Helps users understand JSON-LD impact

5. **Key Loader Utility** (`packages/utils/loadKeys.ts`)
   - Centralized key loading
   - Injects keys into process.env
   - Used across API routes

6. **Path Aliases** (`tsconfig.json`)
   - Cleaner imports with `@core/*`, `@ai/*`, etc.
   - Better developer experience
   - Easier refactoring

### Backward Compatibility
- `/s/[slug]` routes still work (redirect to `/m/[slug]`)
- Symbol files remain in `/public/symbols/`
- Gradual migration path

## Next Steps

1. **Enhance Refine API** with z.ai chat completion
2. **Connect Critique API** to real analysis engine
3. **Build Share Modal UI** component
4. **Add Asset Generation** for logos/icons
5. **Implement Export Flow** (Next.js/static)

## Implementation Notes

- Minimal stubs are intentional - ready for AI enhancement
- Path aliases defined in root `tsconfig.json`
- All routes are TypeScript for type safety
- Error handling included in all API routes

