'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

type DockMode = 'ask' | 'code'
type DockStatus = 'idle' | 'analyzing' | 'planning' | 'implementing' | 'complete' | 'error'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  modeAtSend: DockMode
  text: string
  createdAt: string
  annotations?: { badge?: 'ASK' | 'CODE' | 'PLAN' | 'APPLIED'; diffId?: string }
  stateSnapshot?: {
    metadata: any
    schema: any
    timestamp: string
  }
}

interface PlanStep {
  id: string
  title: string
  description?: string
  patch?: { file: string; from?: string; to?: string; diff?: string }
}

interface DockSession {
  mode: DockMode
  status: DockStatus
  messages: Message[]
  lastPlan?: PlanStep[]
}

interface EditDockProps {
  slug: string
  isOpen: boolean
  onClose: () => void
  onToggle: () => void
}

export default function EditDock({ slug, isOpen, onClose, onToggle }: EditDockProps) {
  const [session, setSession] = useState<DockSession>({
    mode: 'code',
    status: 'idle',
    messages: [],
    lastPlan: []
  })
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus()
      // Load persisted session
      loadSession()
    }
  }, [isOpen, slug])

  useEffect(() => {
    scrollToBottom()
  }, [session.messages])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && isOpen) {
        e.preventDefault()
        onToggle()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose, onToggle])

  useEffect(() => {
    // Prevent background scroll
    if (isOpen) {
      document.body.style.overscrollBehavior = 'contain'
      return () => {
        document.body.style.overscrollBehavior = ''
      }
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function loadSession() {
    try {
      const res = await fetch(`/api/marks/${slug}/dock/state`)
      const data = await res.json()
      if (data.ok && data.session && data.session.messages) {
        setSession(data.session)
      }
    } catch (err) {
      console.error('Failed to load session:', err)
    }
  }

  async function handleJumpBack(messageId: string) {
    try {
      const res = await fetch(`/api/marks/${slug}/dock/jump-back`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId })
      })
      const data = await res.json()
      
      if (data.ok) {
        // Reload the session to show truncated messages
        await loadSession()
        // Reload the page to show the reverted state
        window.location.reload()
      } else {
        alert('Failed to jump back: ' + (data.message || 'Unknown error'))
      }
    } catch (err: any) {
      alert('Failed to jump back: ' + err.message)
    }
  }

  async function sendMessage() {
    if (!input.trim() || session.status === 'implementing') return

    const userInput = input
    const currentMode = session.mode

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      modeAtSend: currentMode,
      text: userInput,
      createdAt: new Date().toISOString()
    }

    setInput('')
    setSession(prev => ({ ...prev, messages: [...prev.messages, userMsg], status: 'analyzing' }))

    try {
      const res = await fetch(`/api/marks/${slug}/dock/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userInput, mode: currentMode })
      })
      const data = await res.json()

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        modeAtSend: currentMode,
        text: data.message || 'Done.',
        createdAt: new Date().toISOString(),
        annotations: { badge: currentMode === 'code' ? 'CODE' : 'ASK' },
        stateSnapshot: data.stateSnapshot // Store the snapshot if provided
      }

      setSession(prev => {
        const updated: DockSession = {
          ...prev,
          messages: [...prev.messages, aiMsg],
          status: currentMode === 'code' ? 'implementing' : 'complete'
        }
        
        // Persist after updating with AI response
        fetch(`/api/marks/${slug}/dock/state`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session: updated })
        }).catch(() => {})
        
        return updated
      })

      // If Code mode, set complete after a moment
      if (currentMode === 'code') {
        setTimeout(() => {
          setSession(prev => {
            const updated: DockSession = { ...prev, status: 'complete' }
            fetch(`/api/marks/${slug}/dock/state`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ session: updated })
            }).catch(() => {})
            return updated
          })
          setTimeout(() => {
            setSession(prev => {
              const updated: DockSession = { ...prev, status: 'idle' }
              // Persist final state before refresh
              fetch(`/api/marks/${slug}/dock/state`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session: updated })
              }).catch(() => {})
              // Refresh the page to show changes
              setTimeout(() => window.location.reload(), 300)
              return updated
            })
          }, 1500)
        }, 500)
      } else {
        setSession(prev => {
          const updated: DockSession = { ...prev, status: 'idle' }
          fetch(`/api/marks/${slug}/dock/state`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session: updated })
          }).catch(() => {})
          return updated
        })
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        modeAtSend: currentMode,
        text: `Error: ${err.message}`,
        createdAt: new Date().toISOString()
      }
      setSession(prev => {
        const updated: DockSession = {
          ...prev,
          messages: [...prev.messages, errorMsg],
          status: 'error'
        }
        fetch(`/api/marks/${slug}/dock/state`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session: updated })
        }).catch(() => {})
        return updated
      })
      setTimeout(() => {
        setSession(prev => ({ ...prev, status: 'idle' }))
      }, 2000)
    }
  }

  async function toggleMode() {
    const newMode: DockMode = session.mode === 'ask' ? 'code' : 'ask'
    
    // If switching Ask→Code with a plan, replay it
    if (session.mode === 'ask' && newMode === 'code' && session.lastPlan && session.lastPlan.length > 0) {
      setSession(prev => ({ ...prev, status: 'implementing' }))
      
      try {
        const res = await fetch(`/api/marks/${slug}/dock/implement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: session.lastPlan })
        })
        const data = await res.json()
        
        const aiMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          modeAtSend: 'code',
          text: `✓ Implemented ${session.lastPlan.length} planned changes.`,
          createdAt: new Date().toISOString(),
          annotations: { badge: 'APPLIED' }
        }
        
        setSession(prev => {
          const updated: DockSession = {
            ...prev,
            messages: [...prev.messages, aiMsg],
            status: 'complete',
            mode: newMode
          }
          fetch(`/api/marks/${slug}/dock/state`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session: updated })
          }).catch(() => {})
          return updated
        })
        setTimeout(() => {
          setSession(prev => {
            const updated: DockSession = { ...prev, status: 'idle' }
            fetch(`/api/marks/${slug}/dock/state`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ session: updated })
            }).catch(() => {})
            // Refresh to show changes
            setTimeout(() => window.location.reload(), 300)
            return updated
          })
        }, 1500)
      } catch (err) {
        setSession(prev => ({ ...prev, status: 'error' }))
      }
    } else {
      setSession(prev => {
        const updated: DockSession = { ...prev, mode: newMode }
        fetch(`/api/marks/${slug}/dock/state`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session: updated })
        }).catch(() => {})
        return updated
      })
    }
  }

  const statusText = {
    idle: 'Ready',
    analyzing: 'Analyzing…',
    planning: 'Planning…',
    implementing: 'Implementing…',
    complete: '✓ Complete',
    error: 'Error'
  }[session.status]

  const hasPlanToReplay = session.mode === 'ask' && session.lastPlan && session.lastPlan.length > 0

  return (
    <>
      <div 
        className={`fixed bottom-0 left-0 right-0 transition-transform duration-500 ease-out z-30 ${
          isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Toggle Handle */}
          <div className="cursor-pointer" onClick={onToggle}>
            <div className="bg-[#0B0C10] border-t border-l border-r border-white/10 rounded-t-2xl px-6 py-3 flex items-center justify-between shadow-[0_-8px_30px_rgba(255,45,170,0.1)]">
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <span className={`w-2 h-2 rounded-full ${
                  session.status === 'implementing' || session.status === 'analyzing'
                    ? 'bg-green-400 animate-pulse'
                    : session.status === 'complete'
                    ? 'bg-green-400'
                    : 'bg-neutral-600'
                }`}></span>
                {statusText}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">
                  {session.mode === 'code' ? 'Building' : 'Asking'}
                </span>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none"
                  className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Dock Content */}
          {isOpen && (
            <div 
              className="bg-[#0B0C10] border-t border-l border-r border-white/10 rounded-t-2xl shadow-[0_-10px_40px_rgba(255,45,170,0.15)]"
              role="dialog"
              aria-modal="true"
              aria-label="Edit dock"
            >
              {/* Messages */}
              <div className="h-64 overflow-y-auto px-4 py-3 space-y-3">
                {session.messages.length === 0 && (
                  <div className="text-center text-neutral-500 py-8">
                    <p className="text-sm">Tell me what you want to change or add...</p>
                  </div>
                )}
                {session.messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`max-w-[80%] rounded-xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-white/10 text-white'
                        : 'bg-white/5 text-neutral-300'
                    }`}>
                      {msg.annotations?.badge && (
                        <div className="text-xs mb-1 opacity-70 capitalize">{msg.annotations.badge}</div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      {msg.stateSnapshot && idx > 0 && (
                        <button
                          onClick={() => handleJumpBack(msg.id)}
                          className="mt-2 text-xs text-accent-cyan hover:text-accent-cyan/80 underline"
                        >
                          ↶ Jump back here
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-white/10 p-4 space-y-2">
                <div className="flex gap-2">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Tell me what you want to change or add..."
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none resize-none text-sm"
                    rows={2}
                    disabled={session.status === 'implementing'}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hasPlanToReplay && (
                      <button
                        onClick={toggleMode}
                        className="px-3 py-1.5 rounded-lg text-xs bg-gradient-to-r from-[#FF2DAA] to-[#33FFF2] text-black font-medium"
                      >
                        ✓ Replay Plan
                      </button>
                    )}
                    {!hasPlanToReplay && (
                      <button
                        onClick={toggleMode}
                        className="px-3 py-1.5 rounded-lg text-xs bg-white/10 hover:bg-white/20"
                      >
                        {session.mode === 'code' ? '✓ Building' : '⟳ Ask Only'}
                      </button>
                    )}
                    <span className="text-xs text-neutral-500">
                      {session.mode === 'code' ? 'AI will implement' : 'AI will discuss'}
                    </span>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || session.status === 'implementing'}
                    className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {session.status === 'implementing' ? 'Working...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-20 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  )
}

