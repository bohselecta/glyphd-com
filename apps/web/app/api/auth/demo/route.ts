import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Set demo user cookie
    const demoUserId = 'demo-user-' + Date.now()
    cookieStore.set('demo-user', demoUserId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return NextResponse.json({
      ok: true,
      message: 'Demo login successful',
      user: {
        id: demoUserId,
        email: 'demo@example.com'
      }
    })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message },
      { status: 500 }
    )
  }
}

