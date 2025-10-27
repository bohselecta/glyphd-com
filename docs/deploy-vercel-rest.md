# REST-based Vercel Deploy

This API packs the **Symbol folder** (`apps/web/public/symbols/<slug>`) and POSTs it to Vercel Deployments API v13.

**Env**
```
VERCEL_TOKEN=...
```

**Endpoint**
- `POST /api/deploy` with JSON `{ "slug": "<symbol-slug>" }`

**Response**
```
{ ok: true, url: "<deployment-url>", inspectorUrl: "...", id: "..." }
```

> Note: This creates a static deployment directly from files. For full Next.js projects, wire to your Vercel project instead.
