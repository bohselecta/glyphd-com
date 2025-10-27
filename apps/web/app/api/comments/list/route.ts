import { NextResponse } from 'next/server'

const comments: Record<string, Array<{
  id: string
  by: string
  body: string
  createdAt: number
}>> = {}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const markId = url.searchParams.get('markId') || ''
    const cursor = parseInt(url.searchParams.get('cursor') || '0', 10)
    const pageSize = 20
    
    const list = comments[markId] || []
    const items = list.slice(cursor, cursor + pageSize)
    const nextCursor = cursor + pageSize < list.length 
      ? String(cursor + pageSize) 
      : undefined
    
    return NextResponse.json({ items, nextCursor })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

