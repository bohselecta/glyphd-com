# v7 Additions
- **Symbol → Next.js export**: `POST /api/export/nextapp` creates `/exports/<slug>-nextapp/` with a runnable Next app and assets.
- **Marketplace**: `/marketplace` lists all symbols with search (`?q=`) and free-only filter (`?free=1`).
- **API Key Vault**: `/settings/keys` with `GET/PUT /api/keys` storing values in `/keys/keys.json` (dev-only).
- UI shortcuts: links to Marketplace and API Keys; export button on build results.
