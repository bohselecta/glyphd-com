import { NextResponse } from 'next/server'
import { chatZAI } from '@ai/zaiClient'

export async function GET() {
  try {
    const resp = await chatZAI(
      [
        { role: 'system', content: 'Return JSON {headline, sub}' },
        { role: 'user', content: 'Write a short headline and subline about a neon portfolio site.' }
      ],
      { task: 'copy', logCost: true }
    )
    return NextResponse.json({ ok: true, model: resp.model, content: resp.content, usage: resp.usage })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

