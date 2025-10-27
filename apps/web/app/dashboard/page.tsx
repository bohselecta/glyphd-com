import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

function listSymbols() {
  // Try both possible paths for symbols
  let dir = path.join(process.cwd(), 'public/symbols')
  if (!fs.existsSync(dir)) {
    dir = path.join(process.cwd(), 'apps/web/public/symbols')
  }
  if (!fs.existsSync(dir)) {
    dir = path.join(process.cwd(), 'apps/web/apps/web/public/symbols')
  }
  try {
    const names = fs.readdirSync(dir).filter(n => !n.startsWith('.') && n !== '.gitkeep')
    return names.map(n => ({
      name: n,
      href: `/s/${n}`,
      thumb: `/symbols/${n}/hero.png`
    }))
  } catch { return [] }
}

export default function Dashboard() {
  const symbols = listSymbols()
  return (
    <main className="min-h-dvh p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-h1 font-semibold text-text-primary">Gallery</h1>
          <div className="flex items-center gap-3 text-sm">
            <a href="/" className="text-text-secondary hover:text-accent-cyan">Create Mark</a>
            {/* Future: Filter/Sort controls when auth/db is implemented */}
            {/* <select className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm">
              <option>All Projects</option>
              <option>My Projects</option>
              <option>Shared</option>
            </select> */}
          </div>
        </div>

        {/* Header caption */}
        <p className="text-text-secondary text-ui">
          Discover projects created with Glyphd. Browse and get inspired by other marks.
        </p>

        {symbols.length === 0 ? (
          <div className="glass p-8 text-center rounded-xl">
            <p className="text-text-secondary text-ui mb-2">No marks yet.</p>
            <a href="/" className="btn-primary inline-block text-text-primary hover:text-accent-cyan">Create your first Mark →</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {symbols.map(s => (
              <a key={s.name} href={s.href} className="glass p-4 block hover:bg-white/5 transition-colors rounded-xl group">
                <div className="aspect-video bg-white/5 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  <img 
                    src={s.thumb} 
                    alt={s.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-ui font-medium text-text-primary">{s.name}</div>
                <div className="text-caption text-text-muted mt-1">Click to view →</div>
              </a>
            ))}
          </div>
        )}

        {/* Future: Pagination, search, sharing indicators, user attribution */}
      </div>
    </main>
  )
}
