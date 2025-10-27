'use client'
import { useEffect, useState } from 'react'

export default function EditSymbol({ params }: { params: { slug: string }}) {
  const slug = params.slug
  const [meta, setMeta] = useState<any>(null)
  const [schema, setSchema] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/symbols/${slug}`)
      const d = await r.json()
      setMeta(d.meta); setSchema(d.schema || {})
    })()
  }, [slug])

  async function save() {
    setSaving(true)
    const r = await fetch(`/api/symbols/${slug}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ meta, schema })
    })
    const d = await r.json()
    setMsg(d.ok ? 'Saved!' : d.message || 'Error')
    setSaving(false)
  }

  return (
    <main className="min-h-dvh p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <a href={`/s/${slug}`} className="text-neutral-400 hover:text-white">← Back</a>
          <h1 className="text-2xl font-semibold">Edit Symbol</h1>
        </div>

        {!meta ? <div>Loading…</div> : (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass p-3 rounded-2xl">
              <h2 className="text-lg mb-2">Metadata</h2>
              <label className="text-sm">Headline</label>
              <input className="w-full bg-transparent outline-none border border-white/10 rounded-xl px-3 py-2 mb-2"
                value={meta.headline || ''}
                onChange={e=>setMeta({...meta, headline:e.target.value})}
              />
              <label className="text-sm">Sub</label>
              <textarea className="w-full bg-transparent outline-none border border-white/10 rounded-xl px-3 py-2"
                rows={4}
                value={meta.sub || ''}
                onChange={e=>setMeta({...meta, sub:e.target.value})}
              />
            </div>
            <div className="glass p-3 rounded-2xl">
              <h2 className="text-lg mb-2">Schema JSON</h2>
              <textarea className="w-full bg-transparent outline-none border border-white/10 rounded-xl px-3 py-2 font-mono text-xs"
                rows={20}
                value={JSON.stringify(schema, null, 2)}
                onChange={e=>{ try{ setSchema(JSON.parse(e.target.value)) } catch{} }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">
            {saving ? 'Saving…' : 'Save'}
          </button>
          {msg && <span className="text-sm text-neutral-400">{msg}</span>}
        </div>
      </div>
    </main>
  )
}
