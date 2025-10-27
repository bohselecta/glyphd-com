/**
 * Cron job to check for expired turns and advance automatically
 * Run every 10 minutes
 */

async function run() {
  const now = Date.now()
  console.log('[cron] turnTimeout', new Date(now).toISOString())
  
  const fs = await import('fs')
  const path = await import('path')
  
  const collabsDir = path.join(process.cwd(), 'apps/web/public/collabs')
  
  if (!fs.existsSync(collabsDir)) {
    console.log('No collabs directory found')
    return
  }
  
  const files = fs.readdirSync(collabsDir).filter(f => f.endsWith('.json') && !f.includes('-proposals') && !f.includes('-votes'))
  
  for (const file of files) {
    const collabFile = path.join(collabsDir, file)
    const collab = JSON.parse(fs.readFileSync(collabFile, 'utf-8'))
    
    if (collab.status !== 'active') continue
    
    // Check if turn expired
    const expiresAt = new Date(collab.turn.expiresAt).getTime()
    
    if (now > expiresAt) {
      console.log(`Expired turn in ${collab.id}`)
      
      // Check timeout count
      const timeoutKey = `timeout:${collab.id}:${collab.turn.userId}`
      const timeoutCount = (collab as any)[timeoutKey] || 0
      
      if (timeoutCount >= 1) {
        // Mark as abandoned
        const { addEvent } = await import('../../packages/core/builder_points')
        addEvent({ type: 'collab.abandoned', by: collab.turn.userId, markId: collab.markId, ts: Date.now() })
        collab.status = 'abandoned'
      } else {
        (collab as any)[timeoutKey] = timeoutCount + 1
      }
      
      // Advance turn
      const participants = collab.participants.map((p: any) => p.userId)
      const nextIndex = participants.indexOf(collab.turn.userId) + 1
      const nextUserId = participants[nextIndex % participants.length]
      
      collab.turn = {
        index: collab.turn.index + 1,
        userId: nextUserId,
        startedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
      
      fs.writeFileSync(collabFile, JSON.stringify(collab, null, 2))
    }
  }
}

run().catch(e => {
  console.error('[cron] turnTimeout error:', e)
  process.exit(1)
})

