import { NextResponse } from 'next/server'
import { limit } from '../../../../lib/limiter'

const follows = new Map<string, Set<string>>()

export async function POST(req: Request) {
  try {
    const { targetUser, userId = 'current-user' } = await req.json()
    
    if (!targetUser) {
      return NextResponse.json({ ok: false, error: 'missing_target' }, { status: 400 })
    }
    
    // Rate limiting
    const key = `rl:follow:${userId}:${Math.floor(Date.now() / 60000)}`
    const ok = await limit(key, 60, 30)
    
    if (!ok) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
    }
    
    const set = follows.get(targetUser) || new Set<string>()
    
    if (set.has(userId)) {
      set.delete(userId)
    } else {
      set.add(userId)
    }
    
    follows.set(targetUser, set)
    
    return NextResponse.json({ 
      ok: true, 
      following: set.has(userId),
      followersCount: set.size 
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

