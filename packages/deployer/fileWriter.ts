import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

export function slugify(name: string) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'symbol'
}

// Check if we're in Vercel or a read-only environment
function isReadOnlyEnv() {
  return process.env.VERCEL === '1' || process.env.VERCEL || 
         typeof fs.existsSync !== 'function' || 
         typeof fs.mkdirSync !== 'function'
}

export function ensureDir(p: string) {
  if (isReadOnlyEnv()) return // Skip in Vercel
  fs.mkdirSync(p, { recursive: true })
}

// Helper to get the correct symbols directory path
function getSymbolsDir() {
  // Try multiple possible paths for different deployment scenarios
  const paths = [
    path.join(process.cwd(), 'public', 'symbols'),           // Root public
    path.join(process.cwd(), 'apps', 'web', 'public', 'symbols'),  // Workspace web
    path.join(process.cwd(), '..', 'public', 'symbols'),     // Parent public
    path.join(process.cwd(), '..', '..', 'public', 'symbols'), // Repository root
    path.join(process.cwd(), '.next', 'static', 'symbols'),  // Build output
  ]
  
  // First, try to find existing directory
  for (const dir of paths) {
    if (fs.existsSync(dir)) return dir
  }
  
  // If none exist, create the most likely one based on cwd
  const likelyPath = process.cwd().includes('apps/web')
    ? path.join(process.cwd(), 'public', 'symbols')
    : path.join(process.cwd(), 'apps', 'web', 'public', 'symbols')
    
  return likelyPath
}

export async function ensureSchemaDir(slug: string) {
  const base = path.join(getSymbolsDir(), slug, 'schemas')
  ensureDir(base)
}

function writeBufferTo(baseDir: string, b: Buffer) {
  if (isReadOnlyEnv()) return // Skip in Vercel
  fs.writeFileSync(path.join(baseDir, 'hero.png'), b)
}

export async function fetchToFile(url: string, baseDir: string): Promise<void> {
  const client = url.startsWith('https') ? https : http
  await new Promise<void>((resolve, reject) => {
    const req = client.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 400) {
        reject(new Error('HTTP ' + res.statusCode))
        return
      }
      const chunks: Buffer[] = []
      res.on('data', (d) => chunks.push(Buffer.from(d)))
      res.on('end', () => {
        try {
          writeBufferTo(baseDir, Buffer.concat(chunks))
          resolve()
        } catch (e) { reject(e) }
      })
    })
    req.on('error', reject)
  })
}

// Support both Symbols and Marks
export async function writeSymbolFiles(symbolName: string, copy: any, img: {url?: string, b64?: string} | undefined) {
  const slug = slugify(symbolName)
  
  // On Vercel, don't write to filesystem (read-only)
  if (process.env.VERCEL || !fs.existsSync || typeof fs.existsSync !== 'function') {
    // Return virtual file structure
    return { slug, path: `/symbols/${slug}/index.html` }
  }
  
  const baseDir = path.join(getSymbolsDir(), slug)
  ensureDir(baseDir)

  // Write metadata
  const meta = {
    name: symbolName,
    slug,
    headline: copy?.headline || 'glyphd',
    sub: copy?.sub || 'Make your mark.',
    createdAt: new Date().toISOString()
  }
  if (!isReadOnlyEnv()) {
    fs.writeFileSync(path.join(baseDir, 'metadata.json'), JSON.stringify(meta, null, 2), 'utf-8')
  }

  // Write image if base64 or URL
  if (img?.b64) {
    const b = Buffer.from(img.b64, 'base64')
    writeBufferTo(baseDir, b)
  } else if (img?.url) {
    try { await fetchToFile(img.url, baseDir) } catch { /* ignore */ }
  }

  // Minimal static HTML preview
  const html = `<!doctype html>
<html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${meta.headline}</title>
<style>
  body { background:#0B0C10; color:#ddd; font-family: ui-sans-serif, system-ui; margin:0; }
  .wrap { max-width:980px; margin:40px auto; padding:16px; }
  .card { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:16px; }
  .grad { background: linear-gradient(120deg,#FF2DAA,#33FFF2); -webkit-background-clip: text; color: transparent; }
  img { width:100%; border-radius:12px; }
</style>
</head>
<body>
  <div class="wrap">
    <h1 class="grad">${meta.headline}</h1>
    <p>${meta.sub}</p>
    <div class="card">
      <img src="./hero.png" alt="hero"/>
    </div>
  </div>
</body></html>`
  if (!isReadOnlyEnv()) {
    fs.writeFileSync(path.join(baseDir, 'index.html'), html, 'utf-8')
  }
  return { slug, path: `/symbols/${slug}/index.html` }
}

export async function writeMarkFiles(name: string, copy: any, img?: {b64?: string, url?: string}) {
  const slug = slugify(name)
  const base = path.join(getSymbolsDir(), slug)
  ensureDir(base)
  
  // Write image if provided
  if (img?.b64) {
    const b = Buffer.from(img.b64, 'base64')
    writeBufferTo(base, b)
  } else if (img?.url) {
    try { await fetchToFile(img.url, base) } catch { /* ignore */ }
  }
  
  const meta = { 
    name, slug, 
    headline: copy?.headline || 'glyphd', 
    sub: copy?.sub || 'Make your mark.', 
    createdAt: new Date().toISOString(), 
    public: false 
  }
  
  if (!isReadOnlyEnv()) {
    fs.writeFileSync(path.join(base, 'metadata.json'), JSON.stringify(meta, null, 2), 'utf-8')
  }
  
  const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${meta.headline}</title><style>body{background:#0B0C10;color:#E5E7EB;font-family:ui-sans-serif;margin:0}.wrap{max-width:980px;margin:40px auto;padding:16px}.card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:16px}.grad{background:linear-gradient(120deg,#FF2DAA,#33FFF2);-webkit-background-clip:text;color:transparent}</style></head>
  <body><div class="wrap"><h1 class="grad">${meta.headline}</h1><p>${meta.sub}</p><div class="card"><img src="./hero.png" alt="hero" style="width:100%;border-radius:12px"/></div></div></body></html>`
  
  if (!isReadOnlyEnv()) {
    fs.writeFileSync(path.join(base, 'index.html'), html, 'utf-8')
  }
  
  return { slug, path: `/symbols/${slug}/index.html` }
}

export async function writeMarkSchema(slug: string, schema: any) {
  if (isReadOnlyEnv()) return // Skip in Vercel
  const dir = path.join(getSymbolsDir(), slug)
  ensureDir(dir)
  fs.writeFileSync(path.join(dir, 'schema.json'), JSON.stringify(schema || {}, null, 2), 'utf-8')
}

export async function writeSymbolSchema(slug: string, schema: any) {
  if (isReadOnlyEnv()) return // Skip in Vercel
  const baseDir = path.join(getSymbolsDir(), slug)
  ensureDir(baseDir)
  fs.writeFileSync(path.join(baseDir, 'schema.json'), JSON.stringify(schema || {}, null, 2), 'utf-8')
}

export async function writeSchemaEntry(slug: string, type: string, data: any) {
  if (isReadOnlyEnv()) return // Skip in Vercel
  const dir = path.join(getSymbolsDir(), slug, 'schemas')
  ensureDir(dir)
  fs.writeFileSync(path.join(dir, `${type}.json`), JSON.stringify(data || {}, null, 2), 'utf-8')
}
