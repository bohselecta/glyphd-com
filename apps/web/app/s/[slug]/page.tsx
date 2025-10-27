import fs from 'fs'
import path from 'path'
import { tokens } from '../../../components/tokens'
import { buildJSONLD } from '@schemas/jsonldTemplates'
import ShareButton from '../../../components/ShareButton'
import EditButton from '../../../components/EditButton'
import EditWrapper from './client-edit'

export const dynamic = 'force-dynamic'

function readSymbol(slug: string) {
  // Try multiple possible paths
  let base = path.join(process.cwd(), 'public/symbols', slug)
  if (!fs.existsSync(path.join(base, 'metadata.json'))) {
    base = path.join(process.cwd(), 'apps/web/public/symbols', slug)
  }
  if (!fs.existsSync(path.join(base, 'metadata.json'))) {
    base = path.join(process.cwd(), 'apps/web/apps/web/public/symbols', slug)
  }
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(base, 'metadata.json'), 'utf-8'))
    const schemaPath = path.join(base, 'schema.json')
    const schema = fs.existsSync(schemaPath) ? JSON.parse(fs.readFileSync(schemaPath, 'utf-8')) : null
    const hasHero = fs.existsSync(path.join(base, 'hero.png'))
    // load per-type schema data
    const schemasDir = path.join(base, 'schemas')
    let typed: Record<string, any> = {}
    if (fs.existsSync(schemasDir)) {
      const files = fs.readdirSync(schemasDir).filter(f=>f.endsWith('.json'))
      for (const f of files) {
        const type = f.replace(/\.json$/, '')
        typed[type] = JSON.parse(fs.readFileSync(path.join(schemasDir, f), 'utf-8'))
      }
    }
    return { meta, schema, hasHero, slug, typed }
  } catch {
    return null
  }
}

function JSONLDScript({objs}:{objs:any[]}) {
  const j = JSON.stringify(objs, null, 2)
  return (<script type="application/ld+json" dangerouslySetInnerHTML={{__html:j}} />)
}

function SectionHero({slug, meta}:{slug:string, meta:any}) {
  return (
    <section className="space-y-4">
      <h1 className="text-4xl font-semibold" style={{background: tokens.gradients.brand, WebkitBackgroundClip: 'text', color: 'transparent'}}>
        {meta.headline}
      </h1>
      <p className="text-neutral-400">{meta.sub}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/symbols/${slug}/hero.png`} alt="hero" className="w-full rounded-xl border border-white/10"/>
    </section>
  )
}

export default function SymbolPage({ params }: { params: { slug: string }}) {
  const data = readSymbol(params.slug)
  if (!data) return (
    <main className="min-h-dvh p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Mark not found</h1>
        <p className="text-neutral-400">The Mark <code className="bg-white/5 px-2 py-1 rounded">{params.slug}</code> could not be found.</p>
        <div className="flex gap-3">
          <a href="/" className="btn-primary">Create New Mark</a>
          <a href="/dashboard" className="btn-primary">My Marks</a>
        </div>
      </div>
    </main>
  )

  const nav = data.schema?.nav || [{label:'Home',href:'#'},{label:'Features',href:'#features'},{label:'Pricing',href:'#pricing'}]
  const features = data.schema?.features || []
  const plans = data.schema?.pricing || []
  const integrations = data.schema?.integrations || []
  const testimonials = data.schema?.testimonials || []
  const faq = data.schema?.faq || []

  // Build JSON-LD array from typed schema data
  const jsonldObjs: any[] = []
  for (const [k,v] of Object.entries<any>(data.typed||{})) {
    try { jsonldObjs.push(buildJSONLD(k as any, v)) } catch {}
  }

  return (
    <main className="min-h-dvh">
      {jsonldObjs.length > 0 && <JSONLDScript objs={jsonldObjs} />}
      <EditWrapper slug={data.slug} />
      {/* Control Bar */}
      <div className="sticky top-0 z-20 bg-[#0B0C10] border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center gap-4 p-2">
          <a href="/" className="text-white hover:text-neutral-400">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" fill="currentColor"/>
            </svg>
          </a>
          <div className="flex items-center gap-3 text-sm text-neutral-400">
            <a href={`/s/${data.slug}/configure`} className="hover:text-white">Configure</a>
            <EditButton slug={data.slug} />
            <a href={`/s/${data.slug}/view?mode=code`} className="hover:text-white">Code</a>
            <ShareButton slug={data.slug} />
          </div>
        </div>
      </div>

      {/* Project Header */}
      <header className="sticky top-[42px] z-10 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center gap-4 p-3">
          <nav className="flex items-center gap-4 text-sm text-neutral-300">
            {nav.map((n:any,i:number)=>(<a key={i} href={n.href}>{n.label}</a>))}
          </nav>
        </div>
      </header>
      <div className="max-w-5xl mx-auto p-6 space-y-12">
        {data.hasHero && <SectionHero slug={data.slug} meta={data.meta} />}
        {features.length>0 && (
          <section id="features" className="grid sm:grid-cols-2 gap-4">
            {features.map((f:any,i:number)=>(
              <div key={i} className="glass p-4 rounded-2xl">
                <div className="text-lg font-medium" style={{background: tokens.gradients.brand, WebkitBackgroundClip:'text', color:'transparent'}}>{f.title}</div>
                <p className="text-neutral-400 text-sm mt-1">{f.desc}</p>
              </div>
            ))}
          </section>
        )}
        {integrations.length>0 && (
          <section className="glass p-4 rounded-2xl">
            <div className="text-sm text-neutral-400 mb-2">Integrations</div>
            <div className="flex flex-wrap gap-3">
              {integrations.map((it:any,i:number)=>(
                <a key={i} href={it.href || '#'} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {it.badge && <img src={it.badge} alt={it.name} className="h-5"/>}
                  <span className="text-neutral-200 text-sm">{it.name}</span>
                </a>
              ))}
            </div>
          </section>
        )}
        {plans.length>0 && (
          <section id="pricing" className="grid sm:grid-cols-3 gap-4">
            {plans.map((p:any,i:number)=>(
              <div key={i} className="glass p-4 rounded-2xl">
                <div className="text-lg font-medium">{p.name}</div>
                <div className="text-3xl font-semibold mt-2">${p.price}<span className="text-sm text-neutral-400">/mo</span></div>
                <ul className="text-sm mt-3 space-y-1 text-neutral-300">
                  {(p.features||[]).map((x:string,idx:number)=>(<li key={idx}>• {x}</li>))}
                </ul>
                <a href={p.ctaHref || '#'} className="inline-block mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">Choose {p.name}</a>
              </div>
            ))}
          </section>
        )}
        {testimonials.length>0 && (
          <section className="grid sm:grid-cols-2 gap-4">
            {testimonials.map((t:any,i:number)=>(
              <div key={i} className="glass p-4 rounded-2xl">
                <blockquote className="text-neutral-200 italic">“{t.quote}”</blockquote>
                <div className="text-sm text-neutral-400 mt-2">— {t.author}{t.role ? `, ${t.role}` : ''}</div>
              </div>
            ))}
          </section>
        )}
        {faq.length>0 && (
          <section className="space-y-3">
            {faq.map((f:any,i:number)=>(
              <details key={i} className="glass p-3 rounded-xl">
                <summary className="cursor-pointer">{f.q}</summary>
                <div className="text-neutral-400 text-sm mt-2">{f.a}</div>
              </details>
            ))}
          </section>
        )}
      </div>
      <footer className="border-t border-white/10 text-center text-xs text-neutral-500 py-6 mt-12">
        <div className="max-w-5xl mx-auto">
          <p>© {new Date().getFullYear()} glyphd — Make your mark.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href={`/s/${params.slug}/configure`} className="text-neutral-400 hover:text-white">Configure</a>
            <a href={`/s/${params.slug}/edit`} className="text-neutral-400 hover:text-white">Edit</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
