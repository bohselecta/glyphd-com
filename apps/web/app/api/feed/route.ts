import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export interface FeedMark {
  id: string
  title: string
  author: { username: string; avatarUrl?: string; rating: number }
  description: string
  likes: number
  comments: number
  collabs: number
  createdAt: string
  heroImage?: string
  slug: string
}

export interface FeedResponse {
  items: FeedMark[]
  nextCursor?: string
  total: number
}

export type FeedSort = 'new' | 'trending' | 'featured'

// Internal function for calculating trending scores
function calculateTrendingScore(likes24h: number, comments24h: number, ageHrs: number): number {
  const raw = likes24h + 0.5 * comments24h
  const decay = 1 / (1 + 0.08 * ageHrs) // Gentle decay over ~12 hours
  return Math.round(1000 * raw * decay)
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const sort: FeedSort = (url.searchParams.get('sort') as FeedSort) || 'new'
    const cursor = url.searchParams.get('cursor') || '0'
    const limit = parseInt(url.searchParams.get('limit') || '20')
    
    const symbolsDir = path.join(process.cwd(), 'apps/web/public/symbols')
    
    if (!fs.existsSync(symbolsDir)) {
      return NextResponse.json<FeedResponse>({ items: [], total: 0 })
    }
    
    const marks: FeedMark[] = []
    const items = fs.readdirSync(symbolsDir, { withFileTypes: true })
    
    for (const item of items) {
      if (!item.isDirectory()) continue
      
      const metaFile = path.join(symbolsDir, item.name, 'metadata.json')
      if (!fs.existsSync(metaFile)) continue
      
      const metadata = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))
      
      // Check if this mark is public/feed-eligible
      if (metadata.private) continue
      
      const heroImage = metadata.heroImage ? `/symbols/${item.name}/${metadata.heroImage}` : undefined
      const createdAt = metadata.createdAt || new Date().toISOString()
      const ageHrs = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
      
      // Get builder rating
      const builderDir = path.join(process.cwd(), 'apps/web/public/builders')
      const builderFile = path.join(builderDir, `${metadata.author || 'anonymous'}.json`)
      let rating = 0
      if (fs.existsSync(builderFile)) {
        const builder = JSON.parse(fs.readFileSync(builderFile, 'utf-8'))
        rating = Math.round(builder.points || 0)
      }
      
      marks.push({
        id: item.name,
        title: metadata.title || item.name,
        author: { 
          username: metadata.author || 'anonymous',
          avatarUrl: metadata.avatarUrl,
          rating 
        },
        description: metadata.description || '',
        likes: metadata.likes || 0,
        comments: metadata.comments || 0,
        collabs: metadata.collabRequests || 0,
        createdAt,
        heroImage,
        slug: item.name,
        // Add trending score for sorting
        ...(sort === 'trending' ? { _trendingScore: calculateTrendingScore(metadata.likes || 0, metadata.comments || 0, ageHrs) } : {})
      })
    }
    
    // Apply sort
    let sorted = marks
    switch (sort) {
      case 'trending':
        sorted = marks.sort((a, b) => ((b as any)._trendingScore || 0) - ((a as any)._trendingScore || 0))
        break
      case 'featured':
        sorted = marks
          .filter(m => m.collabs > 0)
          .sort((a, b) => b.collabs - a.collabs)
        break
      default: // new
        sorted = marks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    
    // Pagination with cursor
    const cursorNum = parseInt(cursor)
    const paginatedItems = sorted.slice(cursorNum, cursorNum + limit)
    const nextCursor = cursorNum + limit < sorted.length ? String(cursorNum + limit) : undefined
    
    return NextResponse.json<FeedResponse>({ 
      items: paginatedItems,
      nextCursor,
      total: sorted.length 
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { markSlug, action } = await req.json()
    
    if (action === 'post') {
      // Mark as public/feed-eligible
      const metaFile = path.join(process.cwd(), 'apps/web/public/symbols', markSlug, 'metadata.json')
      
      if (!fs.existsSync(metaFile)) {
        return NextResponse.json({ ok: false, error: 'Mark not found' }, { status: 404 })
      }
      
      const metadata = JSON.parse(fs.readFileSync(metaFile, 'utf-8'))
      
      // Check if already posted
      if (metadata.feedPosted) {
        return NextResponse.json({ ok: false, error: 'Already posted to feed' }, { status: 409 })
      }
      
      metadata.private = false
      metadata.feedPosted = true
      metadata.feedPostedAt = new Date().toISOString()
      
      fs.writeFileSync(metaFile, JSON.stringify(metadata, null, 2))
      
      return NextResponse.json({ ok: true, id: markSlug })
    }
    
    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

