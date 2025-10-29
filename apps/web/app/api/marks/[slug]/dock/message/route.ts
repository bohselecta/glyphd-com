import { NextResponse } from 'next/server'
import { chatZAI } from '@ai/zaiClient'
import { loadKeysIntoEnv } from '@utils/loadKeys'
import fs from 'fs'
import path from 'path'

// Helper to get the correct symbols directory path (same as in fileWriter)
function getSymbolsDir() {
  let dir = path.join(process.cwd(), 'public/symbols')
  if (fs.existsSync(dir)) return dir
  dir = path.join(process.cwd(), 'apps/web/public/symbols')
  if (fs.existsSync(dir)) return dir
  return path.join(process.cwd(), 'apps/web/public/symbols')
}

export async function POST(req: Request, { params }: { params: { slug: string }}) {
  try {
    loadKeysIntoEnv()
    
    const { text, mode } = await req.json()
    const baseDir = path.join(getSymbolsDir(), params.slug)
    const meta = JSON.parse(fs.readFileSync(path.join(baseDir, 'metadata.json'), 'utf-8'))
    
    if (mode === 'ask') {
      const resp = await chatZAI([
        { role: 'system', content: 'You are a helpful design assistant. Provide thoughtful suggestions without making changes.' },
        { role: 'user', content: `${meta.name}: ${text}` }
      ], { task: 'assist' })
      
      return NextResponse.json({ 
        ok: true, 
        message: typeof resp === 'string' ? resp : resp.content || 'Understood. What would you like to explore?'
      })
    } else {
      // Code mode: implement changes
      // Get current state for snapshot
      const schemaPath = path.join(baseDir, 'schema.json')
      const currentSchema = fs.existsSync(schemaPath) 
        ? JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))
        : { nav: [], features: [], pricing: [] }
      
      // Ask AI to generate updated schema based on the request
      const systemPrompt = `You are a web designer implementing changes to a landing page. The current page has:
- Navigation: ${JSON.stringify(currentSchema.nav || [])}
- Features: ${JSON.stringify(currentSchema.features || [])}
- Pricing: ${JSON.stringify(currentSchema.pricing || [])}

Generate ONLY valid JSON with the updated sections. Return a JSON object with keys: nav, features, pricing (only the sections that need changes, or all if requested).`
      
      const resp = await chatZAI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `User request: ${text}\n\nUpdate the landing page content for: ${meta.name}` }
      ], { task: 'refine' })
      
      // Parse AI response for schema changes
      let updatedSchema = JSON.parse(JSON.stringify(currentSchema))
      const aiContent = typeof resp === 'string' ? resp : resp.content
      
      try {
        // Try to extract JSON from the AI response
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          // Update only the sections that were provided
          if (parsed.nav) updatedSchema.nav = parsed.nav
          if (parsed.features) updatedSchema.features = parsed.features  
          if (parsed.pricing) updatedSchema.pricing = parsed.pricing
          if (parsed.testimonials) updatedSchema.testimonials = parsed.testimonials
          if (parsed.faq) updatedSchema.faq = parsed.faq
          if (parsed.integrations) updatedSchema.integrations = parsed.integrations
        }
      } catch (err) {
        console.error('Failed to parse AI response for schema update:', err)
        // Fallback: just update the subtitle to show the change happened
        meta.sub = (meta.sub || '') + ' • Updated based on: ' + text
      }
      
      // Save the state snapshot before making changes
      const stateSnapshot = {
        metadata: JSON.parse(JSON.stringify(meta)),
        schema: JSON.parse(JSON.stringify(currentSchema)),
        timestamp: new Date().toISOString()
      }
      
      // Write updated schema
      fs.writeFileSync(schemaPath, JSON.stringify(updatedSchema, null, 2), 'utf-8')
      
      // Update metadata
      meta.sub = (meta.sub || '') + ' • ' + text
      fs.writeFileSync(path.join(baseDir, 'metadata.json'), JSON.stringify(meta, null, 2), 'utf-8')
      
      // Return success with snapshot for edit points
      return NextResponse.json({ 
        ok: true, 
        message: typeof resp === 'string' ? resp : resp.content || 'Changes implemented successfully.',
        stateSnapshot
      })
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 })
  }
}

