import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { markId, toUser } = await req.json()
    
    if (!markId || !toUser) {
      return NextResponse.json({ ok: false, error: 'Missing markId or toUser' }, { status: 400 })
    }
    
    // Check if mark exists
    const metaFile = path.join(process.cwd(), 'apps/web/public/symbols', markId, 'metadata.json')
    if (!fs.existsSync(metaFile)) {
      return NextResponse.json({ ok: false, error: 'Mark not found' }, { status: 404 })
    }
    
    // Create collab
    const collabId = `collab-${markId}-${Date.now()}`
    const collabsDir = path.join(process.cwd(), 'apps/web/public/collabs')
    
    if (!fs.existsSync(collabsDir)) {
      fs.mkdirSync(collabsDir, { recursive: true })
    }
    
    const collabFile = path.join(collabsDir, `${collabId}.json`)
    const metadata = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))
    
    const collab = {
      id: collabId,
      markId,
      owner: metadata.author || 'anonymous',
      participants: [
        { userId: metadata.author || 'anonymous', role: 'owner' },
        { userId: toUser, role: 'collaborator' }
      ],
      turn: { index: 1, userId: metadata.author || 'anonymous', startedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
      status: 'active',
      createdAt: new Date().toISOString(),
      rounds: []
    }
    
    fs.writeFileSync(collabFile, JSON.stringify(collab, null, 2))
    
    // Emit event
    const { addEvent } = await import('@core/builder_points')
    addEvent({ type: 'collab.accepted', by: toUser, markId, ts: Date.now() })
    
    return NextResponse.json({ ok: true, collabId })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

