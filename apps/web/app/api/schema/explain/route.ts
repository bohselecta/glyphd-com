import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'Product'
  
  const explanations: Record<string, string> = {
    Product: 'Product schema helps search engines display rich results in shopping searches and product listings.',
    Offer: 'Offer schema enables price, availability, and shipping information in search results.',
    Service: 'Service schema helps local businesses and service providers appear in relevant searches.',
    Organization: 'Organization schema establishes brand identity in knowledge graphs and search.',
    Event: 'Event schema makes your events appear in Google Events and other calendar integrations.',
    CreativeWork: 'CreativeWork schema is for portfolio pieces, blog posts, and creative content.'
  }
  
  return NextResponse.json({
    ok: true,
    type,
    explanation: explanations[type] || `${type} helps search engines display rich results.`,
    serpPreviewHtml: `<div class="serp-preview"><div class="title">Sample ${type} Result</div><div class="description">This is how it might appear in search results</div></div>`
  })
}

