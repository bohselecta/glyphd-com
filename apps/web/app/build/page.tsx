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
    logMessages.push('Starting AI-powered build...')
    setStatus('Starting build...')
    setProgress(5)
    setLogs([...logMessages])

    // Call actual API immediately
    try {
      logMessages.push('Calling AI services...')
      setStatus('Initializing AI...')
      setProgress(10)
      setLogs([...logMessages])
      
      const res = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, symbol: slug, stream: false })
      })
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await res.text()
        console.error('API returned non-JSON response:', text.substring(0, 200))
        throw new Error(`API error: Server returned ${res.status}. Check console for details.`)
      }
      
      const data = await res.json()
      
      // Log the full response for debugging
      console.log('API Response:', data)
      
      // Check for API errors
      if (!res.ok) {
        throw new Error(data.message || data.error || `HTTP ${res.status}`)
      }
      
      // Update with API logs
      if (data.logs && Array.isArray(data.logs)) {
        logMessages.push(...data.logs)
        setLogs([...logMessages])
      }
      
      setStatus('Processing results...')
      setProgress(90)
      
      if (data.symbol?.slug) {
        logMessages.push('Build complete!')
        setCompleted(true)
        setStatus('Build complete!')
        setProgress(100)
        setLogs([...logMessages])
        
        // Redirect after a moment
        setTimeout(() => {
          router.push(`/m/${data.symbol.slug}`)
        }, 2000)
      } else {
        const errorMsg = data.message || data.error || 'Unknown error'
        setStatus('Build failed: ' + errorMsg)
        logMessages.push('Build failed: ' + errorMsg)
        console.error('Build failed:', data)
        setLogs([...logMessages])
      }
    } catch (err: any) {
      console.error('Build error:', err)
      setStatus('Build error: ' + err.message)
      logMessages.push('Error: ' + err.message)
      logMessages.push('Stack: ' + (err.stack || ''))
      setLogs([...logMessages])
    }
  }

  return (
    <main className="min-h-dvh p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold" style={{background: 'linear-gradient(120deg,#FF2DAA,#33FFF2)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
            Making your mark...
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

