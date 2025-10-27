# v6 Additions
- **Project-bound Vercel deploy** with optional alias and env injection (`/api/deploy/project`); needs `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`.
- **Puter deploy stub** at `/api/deploy/puter` (ready for future fill-in).
- **Richer schema**: testimonials, FAQ, integrations.
- **Symbol editor**: `/s/[slug]/edit` with GET/PUT API at `/api/symbols/[slug]`.
- **Asset Pack generator**: `/api/assets/generate` produces `logo_pack.png`, `icon.png`, `og.png` via Flux.
