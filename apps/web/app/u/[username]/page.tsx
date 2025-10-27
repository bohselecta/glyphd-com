'use client'
import { use, useState, useEffect } from 'react'

interface ProfileProps {
  params: Promise<{ username: string }>
}

interface BuilderData {
  points: number
  likes: number
  comments: number
  merges: number
  acceptedCollabs: number
  featured: number
  abandoned: number
}

export default function ProfilePage({ params }: ProfileProps) {
  const { username } = use(params)
  const [data, setData] = useState<BuilderData>({
    points: 0,
    likes: 0,
    comments: 0,
    merges: 0,
    acceptedCollabs: 0,
    featured: 0,
    abandoned: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/user/${username}`)
        const json = await res.json()
        if (json.points) setData(json.points)
      } catch (e) {
        console.error('Failed to load builder data:', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [username])

  const reputation = data.points || 0

  return (
    <main className="min-h-dvh p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-pink to-accent-cyan flex items-center justify-center text-3xl font-bold text-text-primary">
              {username.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-h2 font-semibold text-text-primary">@{username}</h1>
                <p className="text-text-secondary text-ui">Builder • {data.points} Points</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-h3 font-semibold text-accent-cyan">{reputation}</div>
                  <div className="text-caption text-text-muted">Reputation</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-h3 font-semibold text-text-primary">24</div>
                  <div className="text-caption text-text-muted">Marks</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-h3 font-semibold text-text-primary">❤️ {data.likes}</div>
                  <div className="text-caption text-text-muted">Likes Given</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-h3 font-semibold text-text-primary">🤝 {data.acceptedCollabs}</div>
                  <div className="text-caption text-text-muted">Collabs</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-h3 font-semibold text-text-primary">⭐ {data.featured}</div>
                  <div className="text-caption text-text-muted">Featured</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10">
          <button className="px-4 py-2 text-ui font-medium text-text-primary border-b-2 border-accent-cyan">
            Gallery
          </button>
          <button className="px-4 py-2 text-ui font-medium text-text-secondary hover:text-text-primary">
            Collaborations
          </button>
          <button className="px-4 py-2 text-ui font-medium text-text-secondary hover:text-text-primary">
            Liked
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Placeholder marks */}
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass p-4 rounded-xl group">
              <div className="aspect-video bg-white/5 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                <span className="text-text-muted text-ui">Mark {i}</span>
              </div>
              <div className="text-ui font-medium text-text-primary">Sample Mark {i}</div>
              <div className="flex items-center gap-4 mt-2 text-caption text-text-muted">
                <span>❤️ 42</span>
                <span>💬 8</span>
                <span>🤝 2</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

