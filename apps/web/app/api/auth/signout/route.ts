import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Check for demo mode
    const cookieStore = await cookies()
    const demoUser = cookieStore.get('demo-user')
    
    if (demoUser) {
      // Clear demo session
      cookieStore.delete('demo-user')
      return NextResponse.json({
        ok: true,
        message: 'Signed out successfully'
      })
    }

    // Try Supabase auth
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: 'Signed out successfully'
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message },
      { status: 500 }
    )
  }
}

