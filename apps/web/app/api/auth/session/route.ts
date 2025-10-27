import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Check for demo mode (works without Supabase)
    const cookieStore = await cookies()
    const demoUser = cookieStore.get('demo-user')
    
    if (demoUser) {
      return NextResponse.json({
        ok: true,
        user: {
          id: demoUser.value,
          email: 'demo@example.com',
        }
      })
    }

    // Try Supabase auth
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

