// glyphd v10.1: hybrid builder with cost-aware Z.ai
import { chatZAI } from '../ai/zaiClient'
import { generateImage } from '../ai/imageGen'
import { writeSymbolFiles, writeSymbolSchema, writeSchemaEntry, ensureSchemaDir, writeMarkFiles, writeMarkSchema } from '../deployer/fileWriter'
import { mapIntentToSchemas } from '../designer/mappingEngine'
import { Registry } from '../schemas/schemaRegistry'
import type { PlanType } from '../../config/zaiModels'

export interface BuildResult {
  logs: string[]
  heroImage?: { url?: string, b64?: string }
  copy?: { headline: string, sub: string }
  symbol?: { slug: string, path: string }
  mappedSchemas?: string[]
}

function craftImagePrompt(appPrompt: string) {
  return `High quality hero illustration for a landing page, dark candy tech meets desert nomad neon, hot pink and neon cyan accents, glass panels, ${appPrompt}.`;
}

function minimalTemplate(schemaKey: keyof typeof Registry) {
  const d = Registry[schemaKey]
  const o: any = {}
  for (const k of d.required) {
    // sensible defaults for common fields
    if (k === 'availability') o[k] = 'https://schema.org/InStock'
    else if (k === 'priceCurrency') o[k] = 'USD'
    else if (k === 'startDate') o[k] = new Date().toISOString()
    else o[k] = ''
  }
  return o
}

export async function composeAndBuild(prompt: string, symbolName: string, model='black-forest-labs/FLUX-1-dev', size='1024x576'): Promise<BuildResult> {
  const logs: string[] = []
  logs.push('Intent parsed')

  try {
    const plan: PlanType = (process.env.ZAI_PLAN_TYPE as PlanType) || 'CODING_LITE'
    
    // 0) Map intent to schemas & component hints
    const mapping = mapIntentToSchemas(prompt)
    logs.push('Mapped intent → schemas: ' + mapping.schemas.join(', '))

    // 1) Copy via Z.ai
    logs.push('Calling Z.ai for copy…')
    const copyResp = await chatZAI(
      [
        { role: 'system', content: 'Return ONLY valid JSON with keys: headline, sub.' },
        { role: 'user', content: `Write product copy for: ${prompt}` },
      ],
      { task: 'copy', planType: plan, logCost: true }
    )
    
    let copy = { headline: 'glyphd', sub: 'Make your mark.' }
    try {
      const text = String(copyResp.content || '')
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        copy = { 
          headline: parsed.headline || copy.headline, 
          sub: parsed.sub || copy.sub 
        }
      }
    } catch (err) {
      logs.push('Copy parsing fallback used')
    }
    logs.push('Copy generated')

    // 2) Image
    logs.push('Synthesizing image prompt…')
    const promptImg = craftImagePrompt(prompt)
    logs.push(`Calling DeepInfra image gen: ${model} @ ${size}…`)
    const img = await generateImage(process.env.IMAGE_GEN_API_KEY || '', promptImg, size, model)
    const heroImage = (img?.data?.[0]?.url || img?.data?.[0]?.b64_json)
      ? { url: img.data[0].url, b64: img.data[0].b64_json }
      : undefined
    logs.push('Image generated')

    // 3) Sections & pricing
    logs.push('Calling Z.ai for sections & pricing…')
    const resp2 = await chatZAI(
      [
        { role: 'system', content: 'Return ONLY valid JSON with keys: nav (array of {label,href}), features (array of {title,desc}), pricing (array of {name,price,features[]}). Keep it concise and brand-aligned.' },
        { role: 'user', content: `Create sections for a product/site based on: ${prompt}` },
      ],
      { task: 'mapping', planType: plan, logCost: true }
    )
    
    let nav = null, features = null, pricing = null
    try {
      const text = String(resp2.content || '')
      const j = text.match(/\{[\s\S]*\}/)
      if (j) {
        const o = JSON.parse(j[0])
        nav = o.nav; features = o.features; pricing = o.pricing
      }
    } catch (err) {
      logs.push('Section parsing fallback used')
    }
    logs.push('Sections composed')

    // 4) Write files + schema index and per-type templates
    logs.push('Emitting Symbol files…')
    const symbol = await writeSymbolFiles(symbolName, copy, heroImage)
    await writeSymbolSchema(symbol.slug, { nav, features, pricing, mappedSchemas: mapping.schemas })
    await ensureSchemaDir(symbol.slug)
    for (const key of mapping.schemas) {
      const tmpl = minimalTemplate(key as any)
      await writeSchemaEntry(symbol.slug, key, tmpl)
    }
    logs.push(`Symbol saved: ${symbol.slug}`)

    logs.push('Packaging project plan…')
    return { logs, heroImage, copy, symbol, mappedSchemas: mapping.schemas }
  } catch (err:any) {
    logs.push('Error during build: ' + err.message)
    return { logs }
  }
}
