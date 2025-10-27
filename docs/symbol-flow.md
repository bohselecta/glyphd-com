# Symbol Flow

1. User enters idea (prompt) and optional Symbol name.
2. System composes copy (headline + sub) via Z.ai.
3. System synthesizes hero image via DeepInfra (FLUX-1-dev).
4. Files are written to `/apps/web/public/symbols/<slug>/`:
   - hero.png (or base64 rendered)
   - metadata.json (headline, sub, prompt, model, timestamp)
   - index.html (standalone landing preview)
5. Dashboard lists all symbols found in `/apps/web/public/symbols`.
