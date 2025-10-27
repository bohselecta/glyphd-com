'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      })
      
      const data = await res.json()
      
      if (data.ok) {
        setMessage(data.message)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setMessage(data.error || 'Signup failed')
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
          <h1 className="text-h2 font-semibold text-text-primary">Sign Up</h1>
          <p className="text-ui text-text-secondary">Create your Glyphd account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-ui text-text-secondary block mb-2 font-medium">Username (optional)</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none text-text-primary placeholder:text-text-muted" 
              placeholder="username"
            />
          </div>
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
          <div>
            <label className="text-ui text-text-secondary block mb-2 font-medium">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none text-text-primary placeholder:text-text-muted" 
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>
          {message && (
            <div className={`p-3 rounded-xl text-ui ${
              message.includes('created') 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {message}
            </div>
          )}
          <button 
            type="submit"
            disabled={loading || !email || !password}
            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="text-center text-ui text-text-secondary">
          <a href="/login" className="hover:text-accent-cyan">Already have an account? Log in</a>
        </div>
        
        <div className="text-center">
          <a href="/" className="text-caption text-text-muted hover:text-text-secondary">← Back to home</a>
        </div>
      </div>
    </main>
  )
}

