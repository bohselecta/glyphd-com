import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const PUBLIC_PATHS = [
  '/',
  '/pricing',
  '/feed',
  '/designer',
  '/dashboard',
  '/marketplace',
  '/signup',
  '/login',
  '/api/feed',
  '/api/feed/like',
  '/api/feed/post',
  '/api/build',
  '/api/assets',
  '/api/schema',
  '/api/symbols',
  '/api/share',
  '/api/zai/test',
  '/api/auth',
  '/auth/callback'
]

// Helper to check for demo mode
async function getDemoUser() {
  const cookieStore = await cookies()
  return cookieStore.get('demo-user')
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const method = req.method.toUpperCase()
  
  // Security headers
  const res = NextResponse.next()
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  
  // Allow public paths (GET only)
  if (method === 'GET' && PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return res
  }
  
  // Supabase auth check for protected paths
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle error
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle error
          }
        },
      },
    }
  )
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Check for demo user
  const demoUser = await getDemoUser()
  
  // Check if auth is required for this path
  const isProtectedPath = !PUBLIC_PATHS.some(p => pathname.startsWith(p))
  
  // Only require auth for protected paths
  // Note: Auth is disabled for demo - enable in production
  const requireAuth = false // Set to true for production
  
  // Allow demo user or real user
  const isAuthenticated = user || demoUser
  
  if (requireAuth && isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // CSRF protection for state-changing methods
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    const origin = req.headers.get('origin') || ''
    const host = req.headers.get('host') || ''
    const sameOrigin = origin.endsWith(host)
    const csrf = req.headers.get('x-csrf-token')
    
    if (!sameOrigin && !csrf) {
      return NextResponse.json({ ok: false, error: 'csrf_invalid' }, { status: 403 })
    }
  }
  
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json).*)'
  ]
}

