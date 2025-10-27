import { NextResponse } from 'next/server'
import { limit } from '../../../../lib/limiter'

const comments: Record<string, Array<{
  id: string
  by: string
  body: string
  createdAt: number
}>> = {}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = (req.headers.get('x-forwarded-for') || 'anon').split(',')[0].trim()
    const ok = await limit(`rl:comment:${ip}:${Math.floor(Date.now() / 60000)}`, 60, 10)
    
    if (!ok) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
    }
    
    const { markId, body, by = 'current-user' } = await req.json()
    
    if (!markId || !body) {
      return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
    }
    
    if (!comments[markId]) {
      comments[markId] = []
    }
    
    const id = `${markId}:${Date.now()}`
    comments[markId].unshift({ id, by, body, createdAt: Date.now() })
    
    return NextResponse.json({ ok: true, id })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

