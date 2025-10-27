import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const collabId = url.searchParams.get('collabId')
    const markId = url.searchParams.get('markId')
    
    if (!collabId && !markId) {
      return NextResponse.json({ ok: false, error: 'Missing collabId or markId' }, { status: 400 })
    }
    
    const collabsDir = path.join(process.cwd(), 'apps/web/public/collabs')
    
    let collabFile: string | null = null
    
    if (collabId) {
      collabFile = path.join(collabsDir, `${collabId}.json`)
    } else if (markId) {
      // Find collab by markId
      const files = fs.existsSync(collabsDir) ? fs.readdirSync(collabsDir) : []
      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = JSON.parse(fs.readFileSync(path.join(collabsDir, file), 'utf-8'))
          if (content.markId === markId) {
            collabFile = path.join(collabsDir, file)
            break
          }
        }
      }
    }
    
    if (!collabFile || !fs.existsSync(collabFile)) {
      return NextResponse.json({ ok: true, collab: null })
    }
    
    const collab = JSON.parse(fs.readFileSync(collabFile, 'utf-8'))
    
    // Check for open proposal
    const proposalsFile = path.join(collabsDir, `${collab.id}-proposals.json`)
    const proposals: any[] = fs.existsSync(proposalsFile)
      ? JSON.parse(fs.readFileSync(proposalsFile, 'utf-8'))
      : []
    
    const openProposal = proposals.find(p => !p.resolved)
    
    return NextResponse.json({ ok: true, collab, openProposal })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

