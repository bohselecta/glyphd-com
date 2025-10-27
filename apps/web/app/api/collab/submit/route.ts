import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { collabId, diff, summary, userId } = await req.json()
    
    if (!collabId || !diff || !summary || !userId) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }
    
    const collabsDir = path.join(process.cwd(), 'apps/web/public/collabs')
    const collabFile = path.join(collabsDir, `${collabId}.json`)
    
    if (!fs.existsSync(collabFile)) {
      return NextResponse.json({ ok: false, error: 'Collab not found' }, { status: 404 })
    }
    
    const collab = JSON.parse(fs.readFileSync(collabFile, 'utf-8'))
    
    // Check if it's user's turn
    if (collab.turn.userId !== userId) {
      return NextResponse.json({ ok: false, error: 'Not your turn' }, { status: 403 })
    }
    
    // Check for open proposal
    const proposalsFile = path.join(collabsDir, `${collab.id}-proposals.json`)
    const proposals: any[] = fs.existsSync(proposalsFile)
      ? JSON.parse(fs.readFileSync(proposalsFile, 'utf-8'))
      : []
    
    const hasOpenProposal = proposals.some(p => !p.resolved)
    if (hasOpenProposal) {
      return NextResponse.json({ ok: false, error: 'Proposal already open' }, { status: 409 })
    }
    
    // Create proposal
    const proposalId = `proposal-${Date.now()}`
    const proposal = {
      id: proposalId,
      collabId,
      by: userId,
      round: collab.turn.index,
      diff,
      summary,
      ts: Date.now()
    }
    
    proposals.push(proposal)
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals, null, 2))
    
    // Advance turn (server-side logic)
    const participants = collab.participants.map((p: any) => p.userId)
    const nextIndex = participants.indexOf(collab.turn.userId) + 1
    const nextUserId = participants[nextIndex % participants.length]
    
    collab.turn = {
      index: collab.turn.index + 1,
      userId: nextUserId,
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
    
    collab.rounds = collab.rounds || []
    collab.rounds.push({ index: collab.turn.index - 1, by: userId, proposal })
    
    fs.writeFileSync(collabFile, JSON.stringify(collab, null, 2))
    
    // Emit event
    const { addEvent } = await import('@core/builder_points')
    addEvent({ type: 'collab.submit', by: userId, markId: collab.markId, ts: Date.now() })
    
    return NextResponse.json({ ok: true, proposalId })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

