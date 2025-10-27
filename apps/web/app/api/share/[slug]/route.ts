import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// TODO: Implement share link generation

export async function POST(_: Request, { params }: { params: { slug: string } }) {
  const base = path.join(process.cwd(), 'apps/web/public/symbols', params.slug)
  const metaPath = path.join(base, 'metadata.json')
  
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    meta.public = true
    meta.sharedAt = new Date().toISOString()
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8')
    
    const domain = process.env.PUBLIC_BASE_URL || 'http://localhost:5173'
    return NextResponse.json({ ok: true, url: `${domain}/s/${params.slug}` })
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 })
  }
}

