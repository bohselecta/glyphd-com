'use client'
import { useState } from 'react'

interface EditButtonProps {
  slug: string
}

export default function EditButton({ slug }: EditButtonProps) {
  const [, setDockState] = useState(false)

  function handleClick() {
    // Trigger dock open via custom event
    window.dispatchEvent(new CustomEvent('dock-open', { detail: { slug } }))
    setDockState(true)
  }

  return (
    <button onClick={handleClick} className="hover:text-white">
      Edit
    </button>
  )
}

