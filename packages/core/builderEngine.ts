// glyphd v10.1: hybrid builder with cost-aware z.ai GLM Coding Plan
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

function craftImagePrompt(appPrompt: string, schemas: string[]) {
  console.log('🎨 Crafting image prompt for schemas:', schemas)
  
  // Determine style based on detected app type
  const hasProduct = schemas.includes('Product') || schemas.includes('Offer')
  const hasService = schemas.includes('Service')
  const hasCreative = schemas.includes('CreativeWork') || schemas.includes('Project')
  const hasOrganization = schemas.includes('Organization')
  const hasLocal = schemas.includes('LocalBusiness')
  
  console.log('🎨 Schema checks:', { hasProduct, hasService, hasCreative, hasOrganization, hasLocal })
  
  // Default style for all
  let style = 'modern dark'
  
  // Adjust style based on app type
  if (hasProduct && !hasService) {
    // E-commerce/Product
    style = 'vibrant product photography style, professional lighting, clean white background with subtle gradient, premium look'
    console.log('🎨 Selected style: E-commerce/Product')
  } else if (hasService && hasLocal) {
    // Local business
    style = 'friendly neighborhood vibe, warm welcoming colors, authentic local atmosphere'
  } else if (hasCreative || appPrompt.toLowerCase().includes('portfolio')) {
    // Creative work/Portfolio
    style = 'bold artistic aesthetic, creative color palette, dynamic composition, artistic flair'
  } else if (hasOrganization || appPrompt.toLowerCase().includes('company')) {
    // Corporate/Business
    style = 'professional corporate design, trustworthy blue tones with modern accents, clean minimalist'
  } else if (appPrompt.toLowerCase().includes('restaurant') || appPrompt.toLowerCase().includes('food')) {
    // Food/Restaurant
    style = 'mouth-watering food photography, warm appetizing colors, inviting atmosphere'
  } else if (appPrompt.toLowerCase().includes('fitness') || appPrompt.toLowerCase().includes('gym')) {
    // Fitness
    style = 'energetic motivational vibe, bold colors, dynamic movement, high energy'
  } else if (appPrompt.toLowerCase().includes('wellness') || appPrompt.toLowerCase().includes('spa')) {
    // Wellness/Health
    style = 'calming peaceful aesthetic, soft natural colors, serene tranquil atmosphere'
  } else {
    // Default tech/modern
    style = 'dark candy tech meets desert nomad neon, hot pink and neon cyan accents, glass panels'
    console.log('🎨 Selected style: Default candy tech')
  }
  
  console.log('🎨 Final style:', style)
  return `High quality hero illustration for a landing page, ${style}, ${appPrompt}.`;
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

    // 1) Copy via z.ai GLM
    logs.push('Calling AI for copy…')
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
    const promptImg = craftImagePrompt(prompt, mapping.schemas)
    logs.push(`Calling Image Generator: ${model} @ ${size}…`)
    const img = await generateImage(process.env.IMAGE_GEN_API_KEY || '', promptImg, size, model)
    const heroImage = (img?.data?.[0]?.url || img?.data?.[0]?.b64_json)
      ? { url: img.data[0].url, b64: img.data[0].b64_json }
      : undefined
    logs.push('Image generated')

    // 3) Sections & pricing
    logs.push('Calling AI for sections & pricing…')
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
    return { 
      logs, 
      heroImage, 
      copy, 
      symbol, 
      mappedSchemas: mapping.schemas,
      schema: { nav, features, pricing }
    }
  } catch (err:any) {
    logs.push('Error during build: ' + err.message)
    return { logs }
  }
}
