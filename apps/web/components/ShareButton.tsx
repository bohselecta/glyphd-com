'use client'

interface ShareButtonProps {
  slug: string
}

export default function ShareButton({ slug }: ShareButtonProps) {
  async function handleShare() {
    const r = await fetch(`/api/share/${slug}`, { method: 'POST' })
    const d = await r.json()
    if (d.ok) {
      navigator.clipboard.writeText(d.url)
      alert('Share link copied: ' + d.url)
    } else {
      alert('Error: ' + d.message)
    }
  }

  return (
    <button 
      onClick={handleShare}
      className="btn-primary text-xs px-3 py-1.5"
    >
      Share
    </button>
  )
}

