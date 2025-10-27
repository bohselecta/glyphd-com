import { NextResponse } from 'next/server'
import { getBuilderPoints } from '@core/builder_points'

export async function GET(_: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params
    const points = getBuilderPoints(username)
    
    return NextResponse.json({ ok: true, points })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

