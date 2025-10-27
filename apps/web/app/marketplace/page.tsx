import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

function listSymbols() {
  const dir = path.join(process.cwd(), 'apps/web/public/symbols')
  try {
    const names = fs.readdirSync(dir).filter(n => !n.startsWith('.') && n !== '.gitkeep')
    return names.map(n => {
      const base = path.join(dir, n)
      const meta = JSON.parse(fs.readFileSync(path.join(base,'metadata.json'),'utf-8'))
      const schemaPath = path.join(base,'schema.json')
      const schema = fs.existsSync(schemaPath) ? JSON.parse(fs.readFileSync(schemaPath,'utf-8')) : {}
      const isFree = Array.isArray(schema?.pricing) && schema.pricing.some((p:any)=>String(p.name||'').toLowerCase()==='free')
      return { slug:n, meta, isFree, thumb: `/symbols/${n}/hero.png` }
    })
  } catch { return [] }
}

export default function Marketplace() {
  const items = listSymbols()
  return (
    <main className="min-h-dvh p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Marks</h1>
          <a href="/" className="ml-auto text-sm text-neutral-400 hover:text-white">Create Mark →</a>
        </div>

        {/* Simple clientless search via URL ?q= & free filter via ?free=1 (keep SSR simple) */}
        <form className="glass p-3 rounded-2xl" method="GET">
          <div className="grid sm:grid-cols-3 gap-3">
            <input name="q" placeholder="Search..." className="bg-transparent outline-none border border-white/10 rounded-xl px-3 py-2"/>
            <label className="flex items-center gap-2 text-sm text-neutral-400">
              <input type="checkbox" name="free" value="1" className="accent-white/80"/> Free only
            </label>
            <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">Apply</button>
          </div>
        </form>

        <Symbols/>
      </div>
    </main>
  )
}

function Symbols() {
  const dir = path.join(process.cwd(), 'apps/web/public/symbols')
  const url = require('url')
  // read current request URL from NEXT_URL env (Vercel) or default
  const qstr = process.env.NEXT_URL_QUERY || ''
  const params = new url.URLSearchParams(qstr)
  const q = (params.get('q')||'').toLowerCase()
  const freeOnly = params.get('free') === '1'

  const items = listSymbols().filter(s => {
    const matchQ = !q || s.slug.includes(q) || (s.meta.headline||'').toLowerCase().includes(q)
    const matchFree = !freeOnly || s.isFree
    return matchQ && matchFree
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(s => (
        <a key={s.slug} href={`/s/${s.slug}`} className="glass p-2 block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.thumb} alt={s.slug} className="rounded-lg mb-2"/>
          <div className="text-sm">{s.meta.headline}</div>
          <div className="text-xs text-neutral-400">{s.isFree ? 'Free' : 'Premium'}</div>
        </a>
      ))}
    </div>
  )
}
