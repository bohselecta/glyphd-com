// apps/web/app/api/schema/generate/route.ts
import { NextResponse } from 'next/server'
import { buildJSONLD, validateRequired } from '@schemas/jsonldTemplates'

export async function POST(req: Request) {
  const { type, data } = await req.json()
  try {
    const v = validateRequired(type, data || {})
    if (!v.ok) return NextResponse.json({ ok:false, missing: v.missing }, { status: 400 })
    const jsonld = buildJSONLD(type, data || {})
    return NextResponse.json({ ok:true, jsonld })
  } catch (e:any) {
    return NextResponse.json({ ok:false, message: e.message }, { status: 500 })
  }
}
