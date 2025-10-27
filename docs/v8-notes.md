# v8 Additions – Schema & Designer System
- **Unified Schema Registry** (`packages/schemas/schemaRegistry.ts`) with core types and component hints.
- **JSON-LD builders + validation** (`packages/schemas/jsonldTemplates.ts`, API at `/api/schema/generate`).
- **Intent Mapping Engine** (`packages/designer/mappingEngine.ts`) → picks schemas & components from natural language.
- **Designer Console UI** (`/designer`) to test mapping and generate JSON-LD samples.
- **Prompt Templates** for the designer (`packages/designer/promptTemplates.md`).

Use this to translate your massive schema dump into actionable, machine‑readable configs that drive layouts, prompts, and JSON‑LD.
