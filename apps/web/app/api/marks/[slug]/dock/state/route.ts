import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(_: Request, { params }: { params: { slug: string }}) {
  try {
    const file = path.join(process.cwd(), 'apps/web/public/symbols', params.slug, 'dock.json')
    if (!fs.existsSync(file)) {
      return NextResponse.json({ ok: true, session: null })
    }
    const session = JSON.parse(fs.readFileSync(file, 'utf-8'))
    return NextResponse.json({ ok: true, session })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string }}) {
  try {
    const { session } = await req.json()
    const file = path.join(process.cwd(), 'apps/web/public/symbols', params.slug, 'dock.json')
    fs.writeFileSync(file, JSON.stringify(session, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

