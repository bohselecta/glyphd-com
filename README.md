Glyphd — Make Your Mark

AI-powered symbol builder for creative apps, brands, and products.
Glyphd transforms user prompts into deployable web experiences — complete with generated assets, metadata, JSON-LD schema, and Vercel deployment.

🚀 Quick Start

```bash
cd apps/web
npm install

# Configure API keys
cp keys/keys.json.example keys/keys.json
# Edit keys/keys.json with your API keys

npm run dev   # http://localhost:5173
```

📦 **Deployment**: See `DEPLOYMENT.md` for deployment instructions.

🧠 Core Concept

“A Symbol is a living blueprint — a full app, page, or product built from intent.”

When you describe an idea, Glyphd:

Parses intent using Z.ai models

Maps it to known schema types (Product, Service, CreativeWork, etc.)

Generates copy, sections, and pricing

Synthesizes hero & asset images via DeepInfra (Flux-1-dev)

Writes everything to /public/symbols/<slug>/

Injects valid JSON-LD for SEO & knowledge graph visibility

🧩 Features Overview
1. Schema-Driven Symbol System

Each build includes automatically seeded JSON schema files:
/public/symbols/<slug>/schemas/*.json

Supported types: Product, Offer, Service, Organization, Event, CreativeWork, LocalBusiness, etc.

Auto-validated and injected as JSON-LD in each Symbol page.

2. Designer Console

/designer — turn natural language into structured data.
Shows:

Suggested schema types

Matching UI components

Generated JSON-LD preview

3. Symbol Management

/s/[slug] — main live Symbol page

/s/[slug]/edit — metadata & section editor

/s/[slug]/configure — per-schema form editor

/marketplace — searchable Symbol gallery

4. In-App Preview & Management

View live Symbols at `/s/[slug]`

Configure schemas via `/s/[slug]/configure`

Edit metadata at `/s/[slug]/edit`

Generate additional assets on demand

5. Asset Generation

Uses black-forest-labs/FLUX-1-dev via DeepInfra

Generates hero.png, logo_pack.png, icon.png, og.png

🔐 API Keys Configuration

Keys are stored in `keys/keys.json` (create from `keys/keys.json.example`):

- **ZAI_API_KEY**: Z.ai API key for text generation
- **IMAGE_GEN_API_KEY**: DeepInfra API key for image generation  

You can also configure keys via the UI at `/settings/keys`

🧱 Folder Structure
apps/web/
 ├─ app/
 │   ├─ s/[slug]/page.tsx         # Symbol viewer w/ JSON-LD
 │   ├─ s/[slug]/edit/page.tsx    # Metadata editor
 │   ├─ s/[slug]/configure/       # Schema config UI
 │   ├─ designer/                 # Schema mapping console
 │   ├─ api/                      # Build, deploy, schema endpoints
 │
 ├─ public/symbols/
 │   └─ <slug>/
 │       ├─ hero.png
 │       ├─ metadata.json
 │       ├─ schema.json
 │       └─ schemas/
 │           └─ Product.json, Offer.json, etc.
 │
packages/
 ├─ core/                         # builderEngine.ts, deployer
 ├─ designer/                     # mappingEngine.ts, promptTemplates.md
 ├─ schemas/                      # schemaRegistry.ts, jsonldTemplates.ts
 ├─ deployer/                     # fileWriter.ts, REST deploy logic
docs/
 ├─ handoff-v9.md
 └─ symbol-schema.md

💡 Developer Flow
Step	Action	Result
1	Enter idea	Mapped to schema types
2	Copy & image generation	Headline, subtext, hero visuals
3	JSON schema seeding	/schemas/*.json auto-filled
4	Configure schema	GUI for Product, Service, etc.
5	JSON-LD injection	Valid <script> in rendered page
6	Deploy/export	Live symbol or standalone Next.js app
🎨 Design Language

Theme: Dark candy tech × desert nomad neon

Palette: #FF2DAA (hot pink), #33FFF2 (aqua cyan), deep charcoal base

Style: glassmorphism, clean typography, motion-ready layout

🧭 Docs

docs/handoff-v9.md — final architecture summary

docs/symbol-schema.md — full schema reference

docs/deploy-vercel-rest.md — Vercel REST flow

docs/v8-notes.md, docs/v7-notes.md — version changelogs

⚙️ Extending Glyphd

Add new schema types in packages/schemas/schemaRegistry.ts

Expand prompt heuristics in packages/designer/mappingEngine.ts

Integrate new model endpoints in packages/core/builderEngine.ts

Add custom UI layouts under /app/s/[slug]/

🪩 Credits

Built by Hayden @ glyphd.com
Theme, concept, and architecture by Glyphd Labs — “Make your mark.”
