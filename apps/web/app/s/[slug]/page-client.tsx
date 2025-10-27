'use client'
import { useState } from 'react'

export default function MarkPageClient({ slug }: { slug: string }) {
  const [isDockOpen, setIsDockOpen] = useState(false)

  return (
    <EditDock
      slug={slug}
      isOpen={isDockOpen}
      onClose={() => setIsDockOpen(false)}
      onToggle={() => setIsDockOpen(!isDockOpen)}
    />
  )
}

