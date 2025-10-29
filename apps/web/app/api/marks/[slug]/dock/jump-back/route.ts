import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Helper to get the correct symbols directory path
function getSymbolsDir() {
  let dir = path.join(process.cwd(), 'public/symbols')
  if (fs.existsSync(dir)) return dir
  dir = path.join(process.cwd(), 'apps/web/public/symbols')
  if (fs.existsSync(dir)) return dir
  return path.join(process.cwd(), 'apps/web/public/symbols')
}

export async function POST(req: Request, { params }: { params: { slug: string }}) {
  try {
    const { messageId } = await req.json()
    const baseDir = path.join(getSymbolsDir(), params.slug)
    
    // Load the dock session to get the state snapshot
    const dockPath = path.join(baseDir, 'dock.json')
    if (!fs.existsSync(dockPath)) {
      return NextResponse.json({ ok: false, message: 'No conversation history found' }, { status: 404 })
    }
    
    const session = JSON.parse(fs.readFileSync(dockPath, 'utf-8'))
    
    // Find the message with the snapshot
    const targetMessage = session.messages.find((msg: any) => msg.id === messageId && msg.stateSnapshot)
    
    if (!targetMessage || !targetMessage.stateSnapshot) {
      return NextResponse.json({ ok: false, message: 'No state snapshot found for this message' }, { status: 404 })
    }
    
    const snapshot = targetMessage.stateSnapshot
    
    // Restore the files from the snapshot
    fs.writeFileSync(
      path.join(baseDir, 'metadata.json'),
      JSON.stringify(snapshot.metadata, null, 2),
      'utf-8'
    )
    
    fs.writeFileSync(
      path.join(baseDir, 'schema.json'),
      JSON.stringify(snapshot.schema, null, 2),
      'utf-8'
    )
    
    // Truncate messages array to remove everything after the target message
    const messageIndex = session.messages.findIndex((msg: any) => msg.id === messageId)
    if (messageIndex !== -1) {
      session.messages = session.messages.slice(0, messageIndex + 1)
      session.status = 'idle'
      fs.writeFileSync(dockPath, JSON.stringify(session, null, 2), 'utf-8')
    }
    
    return NextResponse.json({ 
      ok: true,
      message: `Reverted to state from ${new Date(snapshot.timestamp).toLocaleString()}`,
      restoredCount: messageIndex + 1
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 })
  }
}

