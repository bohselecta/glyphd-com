import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(_: Request, { params }: { params: { slug: string }}) {
  const dir = path.join(process.cwd(), 'apps/web/public/symbols', params.slug, 'schemas')
  try {
    const files = fs.readdirSync(dir).filter(n => n.endsWith('.json')).map(n => n.replace(/\.json$/, ''))
    return NextResponse.json({ ok: true, types: files })
  } catch {
    return NextResponse.json({ ok: true, types: [] })
  }
}
