'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await res.json()
      
      if (data.ok) {
        setMessage(data.message)
      } else {
        setMessage(data.error || 'Login failed')
      }
    } catch (e: any) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh p-6 flex items-center justify-center">
      <div className="max-w-md w-full glass p-8 rounded-2xl space-y-6">
        <div className="text-center space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="glyphd" className="h-10 mx-auto" />
          <h1 className="text-h2 font-semibold text-text-primary">Log In</h1>
          <p className="text-ui text-text-secondary">Welcome back to Glyphd</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-ui text-text-secondary block mb-2 font-medium">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none text-text-primary placeholder:text-text-muted" 
              placeholder="your@email.com"
              required
            />
          </div>
          {message && (
            <div className={`p-3 rounded-xl text-ui ${
              message.includes('Check your email') 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {message}
            </div>
          )}
          <button 
            type="submit"
            disabled={loading || !email}
            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        
        {/* Demo Login */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-ui text-text-muted">
            <span className="bg-[#0B0C10] px-4">or</span>
          </div>
        </div>
        
        <button 
          onClick={async () => {
            setLoading(true)
            try {
              const res = await fetch('/api/auth/demo', { method: 'POST' })
              const data = await res.json()
              if (data.ok) {
                router.push('/dashboard')
              } else {
                setMessage(data.error || 'Demo login failed')
              }
            } catch (e: any) {
              setMessage(e.message)
            } finally {
              setLoading(false)
            }
          }}
          disabled={loading}
          className="w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-4 py-3 text-ui text-text-primary font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Loading...' : '👤 Continue as Demo User'}
        </button>
        
        <div className="text-center text-ui text-text-secondary">
          <a href="/signup" className="hover:text-accent-cyan">Don't have an account? Sign up</a>
        </div>
        
        <div className="text-center">
          <a href="/" className="text-caption text-text-muted hover:text-text-secondary">← Back to home</a>
        </div>
      </div>
    </main>
  )
}

