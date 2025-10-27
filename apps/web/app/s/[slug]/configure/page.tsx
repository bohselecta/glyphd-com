'use client'
import { useEffect, useState } from 'react'

function Field({name, value, onChange}:{name:string, value:any, onChange:(v:any)=>void}){
  const isObj = typeof value === 'object' && value !== null
  if (isObj) {
    return (
      <div className="mb-2">
        <label className="text-sm text-neutral-400">{name} (JSON)</label>
        <textarea className="w-full bg-transparent outline-none border border-white/10 rounded-xl px-3 py-2 font-mono text-xs"
          rows={4}
          value={JSON.stringify(value, null, 2)}
          onChange={e=>{ try{ onChange(JSON.parse(e.target.value)) } catch{} }}
        />
      </div>
    )
  }
  return (
    <div className="mb-2">
      <label className="text-sm text-neutral-400">{name}</label>
      <input className="w-full bg-transparent outline-none border border-white/10 rounded-xl px-3 py-2"
        value={String(value ?? '')}
        onChange={e=>onChange(e.target.value)}
      />
    </div>
  )
}

export default function Configure({ params }:{ params:{ slug:string }}){
  const slug = params.slug
  const [types, setTypes] = useState<string[]>([])
  const [selected, setSelected] = useState<string>('')
  const [data, setData] = useState<any>(null)
  const [msg, setMsg] = useState('')

  useEffect(()=>{ (async()=>{
    const r = await fetch(`/api/symbols/${slug}/schema/list`)
    const d = await r.json(); setTypes(d.types||[]); setSelected(d.types?.[0]||'')
  })() },[slug])

  useEffect(()=>{ if(!selected) return; (async()=>{
    const r = await fetch(`/api/symbols/${slug}/schema/${selected}`)
    const d = await r.json(); setData(d.data||{})
  })() },[selected, slug])

  async function save(){
    const r = await fetch(`/api/symbols/${slug}/schema/${selected}`, {
      method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data||{})
    })
    const d = await r.json(); setMsg(d.ok ? 'Saved!' : 'Error')
  }

  return (
    <main className="min-h-dvh p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <a href={`/s/${slug}`} className="text-neutral-400 hover:text-white">← Back</a>
          <h1 className="text-2xl font-semibold">Configure Schemas</h1>
        </div>

        <div className="glass p-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <label className="text-sm text-neutral-400">Schema type</label>
            <select className="bg-transparent outline-none border border-white/10 rounded-xl px-3 py-2"
              value={selected} onChange={e=>setSelected(e.target.value)}>
              {types.map(t=>(<option key={t} value={t}>{t}</option>))}
            </select>
            <a href={`/designer`} className="ml-auto text-sm text-neutral-400 hover:text-white">Designer</a>
          </div>

          {data && (
            <div className="mt-4">
              {Object.keys(data).map(k=>(
                <Field key={k} name={k} value={data[k]} onChange={(v:any)=>setData({...data,[k]:v})}/>
              ))}
              <button onClick={save} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 mt-2">Save</button>
              {msg && <span className="text-sm text-neutral-400 ml-2">{msg}</span>}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
