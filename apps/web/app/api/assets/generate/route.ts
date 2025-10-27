import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { generateImage } from '@ai/imageGen'

function loadKeys() {
  const file = path.join(process.cwd(), 'keys', 'keys.json')
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return {}
  }
}

export async function POST(req: Request) {
  const { slug } = await req.json()
  const base = path.join(process.cwd(), 'apps/web/public/symbols', slug)
  if (!fs.existsSync(base)) return NextResponse.json({ ok:false, message:'Symbol not found' }, {status:404})

  // Load keys
  const keys = loadKeys()
  const apiKey = keys.IMAGE_GEN_API_KEY || process.env.IMAGE_GEN_API_KEY || ''
  
  const promptBase = `Brand assets for a modern product, dark candy tech meets desert nomad neon, hot pink and neon cyan accents, minimal logo mark, clean iconography.`
  try {
    console.log('Generating logo...')
    const logo = await generateImage(apiKey, promptBase + ' Vector-like logo on dark canvas.', '1024x576', 'black-forest-labs/FLUX-1-dev')
    console.log('Generating icon...')
    const icon = await generateImage(apiKey, promptBase + ' Square app icon, centered glyph, no text.', '1024x1024', 'black-forest-labs/FLUX-1-dev')
    console.log('Generating OG image...')
    const og = await generateImage(apiKey, promptBase + ' Open Graph banner.', '1200x630', 'black-forest-labs/FLUX-1-dev')
    console.log('All images generated')

    function writeImage(name:string, data:any) {
      const b64 = data?.data?.[0]?.b64_json
      if (b64) fs.writeFileSync(path.join(base, name), Buffer.from(b64, 'base64'))
    }
    writeImage('logo_pack.png', logo)
    writeImage('icon.png', icon)
    writeImage('og.png', og)

    return NextResponse.json({ ok:true, files:['logo_pack.png','icon.png','og.png'] })
  } catch (e:any) {
    return NextResponse.json({ ok:false, message: e.message }, {status:500})
  }
}
