import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json()
    
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { ok: false, error: 'Valid email required' },
        { status: 400 }
      )
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { ok: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username || email.split('@')[0] },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5173'}/auth/callback`
      }
    })

    if (authError) {
      return NextResponse.json(
        { ok: false, error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { ok: false, error: 'Signup failed' },
        { status: 400 }
      )
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: username || email.split('@')[0],
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Continue anyway - profile can be created later
    }

    return NextResponse.json({
      ok: true,
      message: 'Account created! Please check your email to verify.',
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message },
      { status: 500 }
    )
  }
}
