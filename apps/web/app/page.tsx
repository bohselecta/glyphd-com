'use client'
import { useState, useEffect } from 'react'
import { MakeButton, PlanButton } from '../components/buttons'
import OrbBackground from '../components/OrbBackground'

interface Mark {
  slug: string
  name: string
  headline: string
  createdAt: string
}

export default function Home() {
  const [idea, setIdea] = useState('A neon landing page for a photographer named Nova.')
  const [name, setName] = useState('')
  const [building, setBuilding] = useState(false)
  const [message, setMessage] = useState('')
  const [marks, setMarks] = useState<Mark[]>([])
  const [autoPlanner] = useState(true) // Always enabled by default
  const [examples, setExamples] = useState([
    'Create a landing page for a coffee brand with pricing.',
    'Build a product page for an AI writing tool.',
    'Design a portfolio site for a graphic designer.'
  ])

  useEffect(() => {
    loadMarks()
  }, [])

  async function loadMarks() {
    try {
      const res = await fetch('/dashboard')
      const text = await res.text()
      // Parse dashboard data or make API call
      // For now, just set empty
      setMarks([])
    } catch {}
  }

  function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  useEffect(() => {
    if (idea) {
      // Auto-generate slug from prompt (always update for delightful UX)
      const suggested = slugify(idea.substring(0, 30))
      setName(suggested)
    }
  }, [idea])

  function build() {
    if (!idea.trim()) {
      setMessage('Please enter an idea')
      return
    }
    const markSlug = name || slugify(idea.substring(0, 30))
    window.location.href = `/build?prompt=${encodeURIComponent(idea)}&slug=${encodeURIComponent(markSlug)}`
  }

  return (
    <main className="min-h-dvh relative">
      {/* Orb Background */}
      <OrbBackground />
      
      {/* Header */}
      <header className="border-b border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="glyphd" className="h-6" />
            <nav className="flex items-center gap-4 text-sm">
              <a href="/feed" className="text-neutral-400 hover:text-white">Feed</a>
              <span className="text-neutral-600">|</span>
              <a href="/pricing" className="text-neutral-400 hover:text-white">Pricing</a>
              <span className="text-neutral-600">|</span>
              <a href="/login" className="text-neutral-400 hover:text-white">Log In</a>
              <span className="text-neutral-600">|</span>
              <a href="/signup" className="text-neutral-400 hover:text-white">Sign Up</a>
            </nav>
        </div>
      </header>

      <div className="p-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">

        {/* Builder */}
        <div className="glass p-6 space-y-4">
          <label className="text-h4 font-medium text-text-secondary">Make your mark...</label>
          <textarea
            rows={3}
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="Example: Create a dark neon portfolio site for a photographer..."
            className="w-full bg-transparent outline-none resize-none text-bodylg text-text-primary placeholder:text-text-muted"
          />

          <div className="flex gap-2 md:gap-3 items-center flex-wrap">
            <div className="w-[calc(50%-0.25rem)] md:w-auto">
              <PlanButton 
                onClick={() => window.location.href = `/designer?auto=true`}
              />
            </div>
            <div className="w-[calc(50%-0.25rem)] md:w-auto">
              <MakeButton 
                onClick={build} 
                disabled={building}
              />
            </div>
            <div className="w-full md:w-auto md:ml-auto">
              <a href="/dashboard" className="text-ui text-text-secondary hover:text-accent-cyan">Gallery →</a>
            </div>
          </div>

          {message && (
            <div className="text-ui text-text-secondary mt-2">{message}</div>
          )}
        </div>

        {/* Example */}
        <div className="glass p-4">
          <div className="flex items-center flex-wrap gap-2 text-ui">
            <button 
              onClick={() => {
                const suggestions = [
                  'Create a landing page for a coffee brand with pricing.',
                  'Build a product page for an AI writing tool.',
                  'Design a portfolio site for a graphic designer.',
                  'A neon landing page for a VR fitness studio.',
                  'Build a product page for sustainable fashion apparel.',
                  'Design a landing page for a crypto exchange.',
                  'Create a portfolio site for a drone photographer.',
                  'A minimalist landing page for a meditation app.',
                  'Build a product page for solar panel installation.',
                  'Design a landing page for a tequila brand.',
                  'Create a portfolio site for a street artist.',
                  'A landing page for a pet grooming service.',
                  'Build a product page for smart home automation.',
                  'Design a landing page for an escape room business.'
                ]
                const shuffled = [...suggestions].sort(() => Math.random() - 0.5)
                const newSuggestions = shuffled.slice(0, 3)
                setExamples(newSuggestions)
              }}
              className="text-text-secondary hover:text-accent-cyan transition-colors"
              title="Generate new ideas"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hover:rotate-180 transition-transform duration-300">
                <path d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
            </button>
            {examples.map((example, i) => (
              <button 
                key={i} 
                onClick={() => setIdea(example)} 
                className="text-text-primary hover:text-accent-cyan"
              >
                → {example.replace(/^[A-Za-z\s]+(?:landing page|product page|portfolio site)/i, '')}
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
    </main>
  )
}
