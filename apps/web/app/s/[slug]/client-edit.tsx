'use client'
import { useState, useEffect } from 'react'
import EditDock from '../../../components/EditDock'

export default function EditWrapper({ slug }: { slug: string }) {
  const [isDockOpen, setIsDockOpen] = useState(false)

  useEffect(() => {
    const handleOpen = (e: CustomEvent) => {
      if (e.detail.slug === slug) {
        setIsDockOpen(true)
      }
    }
    window.addEventListener('dock-open', handleOpen as EventListener)
    return () => window.removeEventListener('dock-open', handleOpen as EventListener)
  }, [slug])

  return (
    <EditDock
      slug={slug}
      isOpen={isDockOpen}
      onClose={() => setIsDockOpen(false)}
      onToggle={() => setIsDockOpen(!isDockOpen)}
    />
  )
}

