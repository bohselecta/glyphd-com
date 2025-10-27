'use client'
import { useState } from 'react'
import CodeViewer from './CodeViewer'

interface ViewerToggleProps {
  slug: string
}

export default function ViewerToggle({ slug }: ViewerToggleProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview')

  if (view === 'code') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Code View</h2>
          <button
            onClick={() => setView('preview')}
            className="btn-primary text-sm"
          >
            ← Back to Preview
          </button>
        </div>
        <CodeViewer slug={slug} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          onClick={() => setView('code')}
          className="btn-primary text-sm"
        >
          View Code →
        </button>
      </div>
      <p className="text-sm text-neutral-400">Preview content will be inserted here</p>
    </div>
  )
}

