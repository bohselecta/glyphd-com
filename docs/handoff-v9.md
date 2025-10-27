# glyphd – Final Handoff (v9)

**What’s included**
- Builder now maps intent → schemas and seeds per-type JSON templates under `public/symbols/<slug>/schemas/*.json`.
- Symbol pages auto-inject **JSON-LD** (generated from those schema files).
- **Configure** UI at `/s/<slug>/configure` to edit schema data via forms.
- Existing **Edit** page still handles metadata + schema (sections).
- All prior features (v1–v8): deploys, export, marketplace, keys, designer console, etc.

**Typical flow**
1. Enter idea → **Glyph It**.
2. Mapping auto-selects schemas (e.g., Product + Offer) and writes templates.
3. Open Symbol → **Configure** to fill required fields.
4. JSON-LD appears in page `<script type="application/ld+json">…` automatically.
5. Generate assets, deploy, or export as needed.

**Notes**
- Templates fill obvious defaults (e.g., `availability` = InStock, `priceCurrency` = USD). Review before go-live.
- Extend mapping rules in `packages/designer/mappingEngine.ts` and registry in `packages/schemas/schemaRegistry.ts`.
