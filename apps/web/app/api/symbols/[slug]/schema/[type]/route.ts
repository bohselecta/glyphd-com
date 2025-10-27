import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function p(slug:string, type:string){
  const base = path.join(process.cwd(), 'apps/web/public/symbols', slug, 'schemas')
  return { base, file: path.join(base, `${type}.json`) }
}

export async function GET(_: Request, { params }: { params: { slug: string, type: string }}) {
  const { file } = p(params.slug, params.type)
  try {
    const data = JSON.parse(fs.readFileSync(file,'utf-8'))
    return NextResponse.json({ ok:true, data })
  } catch {
    return NextResponse.json({ ok:false, message:'Not found' }, { status: 404 })
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string, type: string }}) {
  const { base, file } = p(params.slug, params.type)
  const body = await req.json()
  fs.mkdirSync(base, { recursive: true })
  fs.writeFileSync(file, JSON.stringify(body || {}, null, 2), 'utf-8')
  return NextResponse.json({ ok:true })
}
