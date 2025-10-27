import { NextResponse } from 'next/server'
import { composeAndBuild } from '@core/builderEngine'
import { loadKeysIntoEnv } from '@utils/loadKeys'

export async function POST(req: Request) {
  try {
    const { prompt, symbol, model, size, stream } = await req.json()
    
    // Load keys from /keys/keys.json and inject into process.env
    loadKeysIntoEnv()
    
    if (stream) {
      // For now, return immediately and let the client handle progress
      // In production, this would use SSE or chunked responses
      const result = await composeAndBuild(prompt, symbol, model, size)
      return NextResponse.json(result)
    } else {
      const result = await composeAndBuild(prompt, symbol, model, size)
      return NextResponse.json(result)
    }
  } catch (err: any) {
    return NextResponse.json({ logs: ['Error: ' + err.message] }, { status: 500 })
  }
}
