// packages/designer/mappingEngine.ts
import { Registry, SchemaKey } from '../schemas/schemaRegistry'

export interface MappingResult {
  schemas: SchemaKey[]
  components: string[]
  rationale: string[]
}

export function mapIntentToSchemas(intent: string): MappingResult {
  const lower = intent.toLowerCase()
  const picks: SchemaKey[] = []
  const comps = new Set<string>()
  const why: string[] = []

  function add(k: SchemaKey, reason: string) {
    if (!picks.includes(k)) picks.push(k)
    Registry[k].componentHints?.forEach(c => comps.add(c))
    why.push(`${k}: ${reason}`)
  }

  // Heuristics (expandable)
  if (/(buy|price|add to cart|product|sku|shop|e-?commerce)/.test(lower)) {
    add('Product','Detected commerce intent'); add('Offer','Pricing & availability')
  }
  if (/(variant|size|color|material)/.test(lower)) add('ProductGroup','Variations detected')
  if (/(service|book|appointment|estimate|quote|repair|law|attorney|plumber)/.test(lower)) {
    add('Service','Service-based intent')
    if (/(near|open|hours|address|phone|map|local)/.test(lower)) add('LocalBusiness','Local info')
  }
  if (/(organization|company|about|team|contact)/.test(lower)) add('Organization','Brand/company info')
  if (/(portfolio|case study|project|campaign)/.test(lower)) { add('CreativeWork','Work showcase'); add('Project','Project context') }
  if (/(video|watch|film|movie|trailer)/.test(lower)) add('VideoObject','Video content')
  if (/(recipe|ingredients|cook)/.test(lower)) add('Recipe','Recipe content')
  if (/(how[- ]?to|steps|tutorial)/.test(lower)) add('HowTo','Guide content')
  if (/(event|webinar|conference|ticket)/.test(lower)) add('Event','Event content')
  if (/(review|rating|testimonial)/.test(lower)) add('Review','Social proof')
  if (/(building|architecture|interior|square footage)/.test(lower)) add('Building','Built environment')
  if (/(dataset|data|chart)/.test(lower)) add('Dataset','Data artefact')
  if (/(music|track|song|recording)/.test(lower)) add('MusicRecording','Music artefact')
  if (/(chat|conversation|messages|forum)/.test(lower)) add('Conversation','Conversation data')
  if (/(lesson|course|tutorial|learning)/.test(lower)) add('LearningResource','Educational content')
  if (picks.length === 0) add('CreativeWork','Default rich content')

  const components = Array.from(comps)
  return { schemas: picks, components, rationale: why }
}
