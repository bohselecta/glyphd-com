import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function paths(slug: string) {
  const base = path.join(process.cwd(), 'apps/web/public/symbols', slug)
  return {
    base,
    meta: path.join(base, 'metadata.json'),
    schema: path.join(base, 'schema.json')
  }
}

export async function GET(_: Request, { params }: { params: { slug: string }}) {
  const p = paths(params.slug)
  try {
    const meta = JSON.parse(fs.readFileSync(p.meta, 'utf-8'))
    const schema = fs.existsSync(p.schema) ? JSON.parse(fs.readFileSync(p.schema, 'utf-8')) : {}
    return NextResponse.json({ ok: true, meta, schema })
  } catch {
    return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 })
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string }}) {
  const p = paths(params.slug)
  const body = await req.json()
  try {
    if (body.meta) fs.writeFileSync(p.meta, JSON.stringify(body.meta, null, 2), 'utf-8')
    if (body.schema) fs.writeFileSync(p.schema, JSON.stringify(body.schema, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 })
  }
}
