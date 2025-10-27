import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ ok: false, user: null })
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
      }
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, user: null, error: e.message },
      { status: 500 }
    )
  }
}

