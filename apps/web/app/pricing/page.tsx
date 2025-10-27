'use client'
import { useState } from 'react'

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)

  async function upgrade(priceId: string, tier: string) {
    setLoading(tier)
    try {
      const r = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId, 
          userId: 'CURRENT_USER_ID', // Replace with actual user ID
          email: 'CURRENT_USER_EMAIL' // Replace with actual email
        })
      })
      const { ok, url, message } = await r.json()
      setLoading(null)
      if (ok && url) {
        window.location.href = url
      } else {
        alert(message || 'Checkout failed')
      }
    } catch (err: any) {
      setLoading(null)
      alert('Error: ' + err.message)
    }
  }

  return (
    <main className="min-h-dvh relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <img 
          src="/bg-smooth-blobs.svg" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-scrim-a"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
          <img src="/logo.svg" alt="glyphd" className="h-6" />
          <nav className="flex items-center gap-4 text-sm">
            <a href="/pricing" className="text-white font-medium">Pricing</a>
            <span className="text-neutral-600">|</span>
            <a href="/login" className="text-neutral-400 hover:text-white">Log In</a>
            <span className="text-neutral-600">|</span>
            <a href="/signup" className="text-neutral-400 hover:text-white">Sign Up</a>
          </nav>
        </div>
      </header>

      <div className="p-6 relative z-10">
        <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">Pricing</h1>
          <p className="text-neutral-400">Choose the plan that fits your needs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <div className="rounded-2xl p-6 border border-white/10 bg-white/5">
            <h2 className="text-xl font-semibold mb-2">Free — Maker Trial</h2>
            <p className="text-sm text-neutral-400 mb-4">
              2 apps/day • 8 edits/app • 2 images/app • 7‑day hosting • one‑time phone check
            </p>
            <button 
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 w-full"
              onClick={() => window.location.href = '/'}
            >
              Start for Free
            </button>
          </div>

          {/* Creator Tier */}
          <div className="rounded-2xl p-6 border border-white/10 bg-white/10 relative">
            <div className="absolute top-4 right-4 px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded">
              POPULAR
            </div>
            <h2 className="text-xl font-semibold mb-2">Creator — $6/mo</h2>
            <p className="text-sm text-neutral-400 mb-4">
              10 apps/day • 24 edits/app • 8 images/app • 100 images/mo • export & deploy • no watermark
            </p>
            <div className="flex gap-2">
              <button 
                disabled={loading === 'monthly'} 
                onClick={() => upgrade(process.env.NEXT_PUBLIC_PRICE_CREATOR_MONTHLY || '', 'monthly')} 
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              >
                {loading === 'monthly' ? 'Loading…' : 'Monthly'}
              </button>
              <button 
                disabled={loading === 'quarterly'} 
                onClick={() => upgrade(process.env.NEXT_PUBLIC_PRICE_CREATOR_QUARTERLY || '', 'quarterly')} 
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              >
                {loading === 'quarterly' ? 'Loading…' : 'Quarterly'}
              </button>
            </div>
          </div>
        </div>

        {/* Features comparison */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">What's Included</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Free Plan</h4>
              <ul className="text-sm text-neutral-400 space-y-1">
                <li>✓ 2 apps per day</li>
                <li>✓ 8 build steps per app</li>
                <li>✓ 2 images per app</li>
                <li>✓ 7-day hosting</li>
                <li>✓ "Made on Glyphd" watermark</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Creator Plan</h4>
              <ul className="text-sm text-neutral-400 space-y-1">
                <li>✓ 10 apps per day</li>
                <li>✓ 24 build steps per app</li>
                <li>✓ 8 images per app</li>
                <li>✓ Unlimited hosting</li>
                <li>✓ No watermark</li>
                <li>✓ Full export & deploy</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
          </div>
        </div>
        </div>
      </div>
    </main>
  )
}
