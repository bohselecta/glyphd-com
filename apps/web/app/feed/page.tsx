'use client'
import { useState, useEffect } from 'react'
import { FeedMark } from '../api/feed/route'

type Filter = 'new' | 'trending' | 'featured' | 'following'

export default function FeedPage() {
  const [filter, setFilter] = useState<Filter>('new')
  const [marks, setMarks] = useState<FeedMark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeed()
  }, [filter])

  async function loadFeed() {
    setLoading(true)
    try {
      const res = await fetch(`/api/feed?sort=${filter}&limit=20`)
      const data = await res.json()
      if (data.ok || data.items) {
        setMarks(data.items || data.marks || [])
      }
    } catch (err) {
      console.error('Failed to load feed:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(slug: string, action: 'like' | 'comment' | 'collab') {
    try {
      await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markSlug: slug, action, value: 1 })
      })
      loadFeed()
    } catch (err) {
      console.error('Action failed:', err)
    }
  }

  return (
    <main className="min-h-dvh relative">
      {/* Background with vignette */}
      <div className="fixed inset-0 -z-10">
        <img 
          src="/bg-smooth-blobs.svg" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-scrim-a"></div>
      </div>
      
      <div className="p-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-h1 font-semibold text-text-primary">Feed</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('new')}
              className={`px-3 py-1.5 rounded-lg text-ui ${
                filter === 'new' ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-white/5 text-text-secondary'
              }`}
            >
              New
            </button>
            <button
              onClick={() => setFilter('trending')}
              className={`px-3 py-1.5 rounded-lg text-ui ${
                filter === 'trending' ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-white/5 text-text-secondary'
              }`}
            >
              🔥 Trending
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-3 py-1.5 rounded-lg text-ui ${
                filter === 'featured' ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-white/5 text-text-secondary'
              }`}
            >
              ⭐ Featured
            </button>
          </div>
        </div>

        {/* Feed */}
        {loading ? (
          <div className="glass p-8 text-center">
            <p className="text-text-secondary text-ui">Loading feed...</p>
          </div>
        ) : marks.length === 0 ? (
          <div className="glass p-8 text-center">
            <p className="text-text-secondary text-ui mb-4">No marks in feed yet.</p>
            <a href="/" className="btn-primary inline-block">Create your first Mark →</a>
          </div>
        ) : (
          <div className="space-y-4">
            {marks.map(mark => (
              <div key={mark.id} className="glass p-6 rounded-xl space-y-4">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="aspect-video w-48 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                    {mark.heroImage ? (
                      <img
                        src={mark.heroImage}
                        alt={mark.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No preview</div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-h3 font-semibold text-text-primary">{mark.title}</h2>
                    </div>
                    <p className="text-text-secondary text-body">{mark.description}</p>
                    <div className="flex items-center gap-4 text-ui text-text-muted">
                      <span>by @{mark.author.username}</span>
                      <span>•</span>
                      <span>{new Date(mark.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleAction(mark.slug, 'like')}
                    className="flex items-center gap-2 text-ui text-text-secondary hover:text-accent-cyan transition-colors"
                  >
                    ❤️ {mark.likes}
                  </button>
                  <button
                    onClick={() => handleAction(mark.slug, 'comment')}
                    className="flex items-center gap-2 text-ui text-text-secondary hover:text-accent-cyan transition-colors"
                  >
                    💬 {mark.comments}
                  </button>
                  <button
                    onClick={() => handleAction(mark.slug, 'collab')}
                    className="flex items-center gap-2 text-ui text-text-secondary hover:text-accent-cyan transition-colors"
                  >
                    🤝 {mark.collabs}
                  </button>
                  <div className="flex-1" />
                  <a
                    href={`/s/${mark.slug}`}
                    className="px-4 py-2 rounded-xl bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30 text-ui font-medium"
                  >
                    View →
                  </a>
                  <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-ui text-text-primary">
                    Request Collaboration
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </main>
  )
}

