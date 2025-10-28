'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function BuildContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prompt = searchParams.get('prompt') || ''
  const slug = searchParams.get('slug') || ''
  
  const [status, setStatus] = useState('Initializing build...')
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!prompt || !slug) return
    buildMark()
  }, [prompt, slug])

  async function buildMark() {
    const logMessages: string[] = []
    logMessages.push('Parsing intent...')
    setStatus('Parsing intent...')
    setProgress(10)
    setLogs([...logMessages])

    // Simulated build steps
    const steps = [
      'Mapping schemas...',
      'Calling AI for copy...',
      'Generating copy...',
      'Synthesizing image prompt...',
      'Calling Image Generator...',
      'Generating hero image...',
      'Calling AI for sections...',
      'Creating sections...',
      'Writing files...',
      'Saving schema templates...',
      'Finalizing...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      logMessages.push(steps[i])
      setStatus(steps[i])
      setProgress(10 + (i + 1) * 7)
      setLogs([...logMessages])
    }

    // Call actual API
    try {
      const res = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, symbol: slug, stream: false })
      })
      const data = await res.json()
      
      // Add API logs to our logs
      if (data.logs) {
        logMessages.push(...data.logs)
        setLogs([...logMessages])
      }
      
      if (data.symbol?.slug) {
        setCompleted(true)
        setStatus('Build complete!')
        setProgress(100)
        
        // Redirect after a moment
        setTimeout(() => {
          router.push(`/m/${data.symbol.slug}`)
        }, 1500)
      } else {
        setStatus('Build failed: ' + (data.message || 'Unknown error'))
      }
    } catch (err: any) {
      setStatus('Build error: ' + err.message)
    }
  }

  return (
    <main className="min-h-dvh p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold" style={{background: 'linear-gradient(120deg,#FF2DAA,#33FFF2)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
            Building your mark...
          </h1>
          <p className="text-neutral-400">{prompt}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300" 
              style={{background: 'linear-gradient(120deg,#FF2DAA,#33FFF2)', width: `${progress}%`}}
            />
          </div>
          <p className="text-sm text-neutral-400 text-center">{progress}%</p>
        </div>

        {/* Status */}
        <div className="glass p-4 text-center">
          <p className="text-lg">{status}</p>
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="glass p-4 space-y-1 max-h-64 overflow-y-auto">
            <p className="text-xs text-neutral-500 mb-2">Activity</p>
            {logs.map((log, i) => (
              <p key={i} className="text-sm text-neutral-400">• {log}</p>
            ))}
          </div>
        )}

        {completed && (
          <div className="glass p-4 text-center text-green-400">
            ✓ Build complete! Redirecting to preview...
          </div>
        )}
      </div>
    </main>
  )
}

export default function BuildPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center">Loading...</div>}>
      <BuildContent />
    </Suspense>
  )
}

