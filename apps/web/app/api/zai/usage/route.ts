import { NextResponse } from 'next/server'
import { getUsageSummary } from '@utils/usageTracker'

export async function GET() {
  try {
    const s = getUsageSummary()
    return NextResponse.json({ ok: true, summary: s })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

