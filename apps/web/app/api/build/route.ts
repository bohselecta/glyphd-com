import { NextResponse } from 'next/server'
import { composeAndBuild } from '@core/builderEngine'
import { loadKeysIntoEnv } from '@utils/loadKeys'
import { createMark } from '../../../lib/database'

export async function POST(req: Request) {
  try {
    const { prompt, symbol, model, size, stream } = await req.json()
    
    console.log('Build request:', { prompt, symbol, model, size })
    
    // Load keys from /keys/keys.json and inject into process.env
    loadKeysIntoEnv()
    
    // Build the project (this creates the JSON but doesn't write files in Vercel)
    const result = await composeAndBuild(prompt, symbol, model, size)
    
    // On Vercel, save to database instead of filesystem
    if (result.symbol?.slug && result.copy) {
      try {
        const { data: markData, error: dbError } = await createMark({
          slug: result.symbol.slug,
          title: result.copy.headline || symbol,
          headline: result.copy.headline,
          sub: result.copy.sub,
          description: result.copy.sub,
          hero_image_url: result.heroImage?.url || result.heroImage?.b64 ? 'generated' : null,
          metadata: {
            heroImage: result.heroImage,
            mappedSchemas: result.mappedSchemas || []
          },
          schema_data: {
            nav: [],
            features: [],
            pricing: [],
            mappedSchemas: result.mappedSchemas || []
          },
          private: false,
          feed_posted: false,
          likes: 0,
          comments: 0,
          collab_requests: 0
        })
        
        if (dbError) {
          console.error('Database error:', dbError)
          // Continue anyway - mark data will be returned
        }
      } catch (dbErr) {
        console.error('Failed to save to database:', dbErr)
        // Continue anyway
      }
    }
    
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Build API error:', err)
    return NextResponse.json({ 
      error: err.message,
      logs: ['Error: ' + err.message],
      stack: err.stack 
    }, { status: 500 })
  }
}
