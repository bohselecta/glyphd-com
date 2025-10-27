import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const collabId = url.searchParams.get('collabId')
    
    if (!collabId) {
      return NextResponse.json({ ok: false, error: 'Missing collabId' }, { status: 400 })
    }
    
    const collabsDir = path.join(process.cwd(), 'apps/web/public/collabs')
    const collabFile = path.join(collabsDir, `${collabId}.json`)
    
    if (!fs.existsSync(collabFile)) {
      return NextResponse.json({ ok: false, error: 'Collab not found' }, { status: 404 })
    }
    
    const collab = JSON.parse(fs.readFileSync(collabFile, 'utf-8'))
    
    return NextResponse.json({ ok: true, rounds: collab.rounds || [] })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

