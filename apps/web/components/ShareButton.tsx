'use client'
import { useState } from 'react'

interface ShareButtonProps {
  slug: string
}

export default function ShareButton({ slug }: ShareButtonProps) {
  const [posted, setPosted] = useState(false)
  const [sharing, setSharing] = useState(false)

  async function handleShare() {
    setSharing(true)
    try {
      const r = await fetch(`/api/share/${slug}`, { method: 'POST' })
      const d = await r.json()
      if (d.ok) {
        navigator.clipboard.writeText(d.url)
        alert('Share link copied: ' + d.url)
      } else {
        alert('Error: ' + d.message)
      }
    } finally {
      setSharing(false)
    }
  }

  async function handlePostToFeed() {
    setSharing(true)
    try {
      await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markSlug: slug, action: 'post', value: 1 })
      })
      setPosted(true)
      setTimeout(() => setPosted(false), 3000)
    } catch (err) {
      alert('Failed to post to feed')
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleShare}
        disabled={sharing}
        className="btn-primary text-xs px-3 py-1.5 disabled:opacity-50"
      >
        {sharing ? 'Sharing...' : 'Share'}
      </button>
      {!posted ? (
        <button 
          onClick={handlePostToFeed}
          disabled={sharing}
          className="px-3 py-1.5 rounded-lg bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30 text-xs font-medium disabled:opacity-50"
        >
          Post to Feed
        </button>
      ) : (
        <span className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs">
          ✓ Posted
        </span>
      )}
    </div>
  )
}

