import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { chatZAI } from '@ai/zaiClient'
import { loadKeysIntoEnv } from '@utils/loadKeys'

// TODO: Implement refine with z.ai chat

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const { prompt, mode, conversation } = await req.json()
  const base = path.join(process.cwd(), 'apps/web/public/symbols', params.slug)
  const metaPath = path.join(base, 'metadata.json')
  const schemaPath = path.join(base, 'schema.json')
  
  try {
    loadKeysIntoEnv()
    
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    const schema = JSON.parse(fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf-8') : '{}')
    
    if (mode === 'ask') {
      // Ask mode: just discuss
      const resp = await chatZAI([
        { role: 'system', content: 'You are a helpful assistant discussing design ideas.' },
        { role: 'user', content: `Project: ${meta.name}\nUser request: ${prompt}` }
      ], { task: 'assist' })
      
      return NextResponse.json({ ok: true, message: typeof resp === 'string' ? resp : resp.content || 'Understood.' })
    } else {
      // Code mode: implement changes
      meta.sub = (meta.sub || '') + ' • ' + (prompt || 'refined')
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8')
      
      return NextResponse.json({ ok: true, message: 'Changes implemented.', meta })
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 })
  }
}

