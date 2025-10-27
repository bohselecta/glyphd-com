'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import CodeViewer from '../../../../components/CodeViewer'

export default function SymbolViewPage({ params }: { params: { slug: string }}) {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'preview'
  
  if (mode === 'code') {
    return (
      <main className="min-h-dvh p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <a href={`/s/${params.slug}`} className="btn-primary text-sm">
              ← Preview
            </a>
            <h2 className="text-xl font-semibold">Code View</h2>
            <div className="w-[100px]"></div>
          </div>
          <CodeViewer slug={params.slug} />
        </div>
      </main>
    )
  }

  return <div>Redirecting to preview...</div>
}

