// apps/web/app/api/designer/map/route.ts
import { NextResponse } from 'next/server'
import { mapIntentToSchemas } from '@designer/mappingEngine'

export async function POST(req: Request) {
  const { intent } = await req.json()
  const res = mapIntentToSchemas(intent || '')
  return NextResponse.json(res)
}
