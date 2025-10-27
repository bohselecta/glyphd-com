import { NextResponse } from 'next/server'
import { getUsage } from '@utils/billing'
import { LIMITS } from '@config/limits'
export async function GET(req: Request){ const url=new URL(req.url); const userId=url.searchParams.get('userId')||'demo-user'; const u=await getUsage(userId); return NextResponse.json({ ok:true, tier:u.tier, usage:u, limits:LIMITS }) }
