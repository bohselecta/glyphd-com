import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { collabId, proposalId, decision, userId } = await req.json()
    
    if (!collabId || !proposalId || !decision || !userId) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }
    
    const collabsDir = path.join(process.cwd(), 'apps/web/public/collabs')
    
    // Load collab
    const collabFile = path.join(collabsDir, `${collabId}.json`)
    if (!fs.existsSync(collabFile)) {
      return NextResponse.json({ ok: false, error: 'Collab not found' }, { status: 404 })
    }
    const collab = JSON.parse(fs.readFileSync(collabFile, 'utf-8'))
    
    // Check if user is participant
    const isParticipant = collab.participants.some((p: any) => p.userId === userId)
    if (!isParticipant) {
      return NextResponse.json({ ok: false, error: 'Not a participant' }, { status: 403 })
    }
    
    // Load proposal
    const proposalsFile = path.join(collabsDir, `${collab.id}-proposals.json`)
    if (!fs.existsSync(proposalsFile)) {
      return NextResponse.json({ ok: false, error: 'No proposals found' }, { status: 404 })
    }
    const proposals: any[] = JSON.parse(fs.readFileSync(proposalsFile, 'utf-8'))
    
    const proposal = proposals.find(p => p.id === proposalId)
    if (!proposal) {
      return NextResponse.json({ ok: false, error: 'Proposal not found' }, { status: 404 })
    }
    
    // Load votes
    const votesFile = path.join(collabsDir, `${collab.id}-votes.json`)
    const votes: any[] = fs.existsSync(votesFile)
      ? JSON.parse(fs.readFileSync(votesFile, 'utf-8'))
      : []
    
    // Check if already voted
    const existingVote = votes.find(v => v.proposalId === proposalId && v.userId === userId)
    if (existingVote) {
      return NextResponse.json({ ok: false, error: 'Already voted' }, { status: 409 })
    }
    
    // Record vote
    votes.push({ collabId, proposalId, userId, decision, ts: Date.now() })
    fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2))
    
    // Check majority
    const proposalVotes = votes.filter(v => v.proposalId === proposalId)
    const yes = proposalVotes.filter(v => v.decision === 'merge').length
    const no = proposalVotes.filter(v => v.decision === 'revert').length
    const participants = collab.participants.length
    const majority = participants / 2
    
    let merged = false
    let reverted = false
    
    if (yes > majority) {
      // Merge approved
      proposal.resolved = true
      proposal.merged = true
      merged = true
      
      // Apply changes to mark (simplified for MVP)
      const markDir = path.join(process.cwd(), 'apps/web/public/symbols', collab.markId)
      if (fs.existsSync(markDir)) {
        // In production, apply diff here
        // For MVP, just mark as merged
      }
      
      // Update round in collab
      collab.rounds = collab.rounds || []
      const round = collab.rounds.find((r: any) => r.proposal?.id === proposalId)
      if (round) {
        round.merged = true
      }
      
      // Emit event
      const { addEvent } = await import('@core/builder_points')
      addEvent({ type: 'collab.merge', by: proposal.by, markId: collab.markId, ts: Date.now() })
    } else if (no > majority) {
      // Revert approved
      proposal.resolved = true
      proposal.reverted = true
      reverted = true
      
      collab.rounds = collab.rounds || []
      const round = collab.rounds.find((r: any) => r.proposal?.id === proposalId)
      if (round) {
        round.reverted = true
      }
    }
    
    // Update proposals
    const proposalIndex = proposals.findIndex(p => p.id === proposalId)
    proposals[proposalIndex] = proposal
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals, null, 2))
    
    // Update collab
    fs.writeFileSync(collabFile, JSON.stringify(collab, null, 2))
    
    return NextResponse.json({ ok: true, merged, reverted })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

