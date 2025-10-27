import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { id, userId } = await req.json()
    
    if (!id || !userId) {
      return NextResponse.json({ ok: false, error: 'Missing id or userId' }, { status: 400 })
    }
    
    // Find which mark this feed item belongs to
    const symbolsDir = path.join(process.cwd(), 'apps/web/public/symbols')
    const items = fs.readdirSync(symbolsDir, { withFileTypes: true })
    
    let metaFile: string | null = null
    for (const item of items) {
      if (!item.isDirectory()) continue
      if (item.name === id) {
        metaFile = path.join(symbolsDir, item.name, 'metadata.json')
        break
      }
    }
    
    if (!metaFile || !fs.existsSync(metaFile)) {
      return NextResponse.json({ ok: false, error: 'Mark not found' }, { status: 404 })
    }
    
    const metadata = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))
    
    // Check for existing like from this user
    const likesFile = path.join(process.cwd(), 'apps/web/public/symbols', id, 'likes.json')
    const existingLikes: Array<{ userId: string; timestamp: string }> = fs.existsSync(likesFile)
      ? JSON.parse(fs.readFileSync(likesFile, 'utf-8'))
      : []
    
    const alreadyLiked = existingLikes.some(l => l.userId === userId)
    
    if (alreadyLiked) {
      // Unlike: remove and decrement
      const newLikes = existingLikes.filter(l => l.userId !== userId)
      fs.writeFileSync(likesFile, JSON.stringify(newLikes, null, 2))
      metadata.likes = Math.max(0, (metadata.likes || 0) - 1)
      fs.writeFileSync(metaFile, JSON.stringify(metadata, null, 2))
      
      return NextResponse.json({ ok: true, likes: metadata.likes, liked: false })
    } else {
      // Like: add and increment
      const newLikes = [...existingLikes, { userId, timestamp: new Date().toISOString() }]
      fs.writeFileSync(likesFile, JSON.stringify(newLikes, null, 2))
      metadata.likes = (metadata.likes || 0) + 1
      fs.writeFileSync(metaFile, JSON.stringify(metadata, null, 2))
      
      return NextResponse.json({ ok: true, likes: metadata.likes, liked: true })
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    const userId = url.searchParams.get('userId')
    
    if (!id || !userId) {
      return NextResponse.json({ liked: false })
    }
    
    const likesFile = path.join(process.cwd(), 'apps/web/public/symbols', id, 'likes.json')
    
    if (!fs.existsSync(likesFile)) {
      return NextResponse.json({ liked: false })
    }
    
    const likes = JSON.parse(fs.readFileSync(likesFile, 'utf-8'))
    const liked = likes.some((l: any) => l.userId === userId)
    
    return NextResponse.json({ liked })
  } catch (e: any) {
    return NextResponse.json({ liked: false })
  }
}

