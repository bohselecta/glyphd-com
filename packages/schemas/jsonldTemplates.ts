// packages/schemas/jsonldTemplates.ts
import { Registry, SchemaKey, JSONObject } from './schemaRegistry'

export function buildJSONLD(type: SchemaKey, data: JSONObject) {
  const d = Registry[type]
  if (!d) throw new Error(`Unknown schema type: ${type}`)
  return d.jsonld(data)
}

export function validateRequired(type: SchemaKey, data: JSONObject) {
  const d = Registry[type]
  const missing = d.required.filter(k => !(k in data))
  return { ok: missing.length === 0, missing }
}
