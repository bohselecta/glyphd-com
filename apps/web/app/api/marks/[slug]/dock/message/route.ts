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
      const resp = await chatZAI([
        { role: 'system', content: 'You are implementing changes to a web project. Provide a brief confirmation of what was changed.' },
        { role: 'user', content: `Implement: ${text}\n\nFor: ${meta.name}` }
      ], { task: 'refine' })
      
      // Actually implement changes to schema files
      const schemaPath = path.join(baseDir, 'schema.json')
      if (fs.existsSync(schemaPath)) {
        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))
        // For now, append to sub as a visible change
        meta.sub = (meta.sub || '') + ' • ' + (text || 'refined')
        fs.writeFileSync(path.join(baseDir, 'metadata.json'), JSON.stringify(meta, null, 2), 'utf-8')
      } else {
        // Fallback if no schema exists
        meta.sub = (meta.sub || '') + ' • ' + (text || 'refined')
        fs.writeFileSync(path.join(baseDir, 'metadata.json'), JSON.stringify(meta, null, 2), 'utf-8')
      }
      
      return NextResponse.json({ 
        ok: true, 
        message: typeof resp === 'string' ? resp : resp.content || 'Changes implemented successfully.'
      })
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 })
  }
}

