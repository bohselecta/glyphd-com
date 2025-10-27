'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '../../../lib/auth'

interface CollabState {
  id: string
  markId: string
  owner: string
  participants: Array<{ userId: string; role: string }>
  turn: { index: number; userId: string; startedAt: string; expiresAt: string }
  status: string
}

interface Proposal {
  id: string
  by: string
  round: number
  diff: Array<{ path: string; before?: string; after?: string }>
  summary: string
  ts: number
}

export default function CollabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { user, loading: authLoading } = useSession()
  const [slug, setSlug] = useState<string>('')
  const [collab, setCollab] = useState<CollabState | null>(null)
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [diff, setDiff] = useState('')
  const [summary, setSummary] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [voting, setVoting] = useState(false)
  
  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])
  
  useEffect(() => {
    if (slug) loadState()
  }, [slug])
  
  async function loadState() {
    setLoading(true)
    try {
      const res = await fetch(`/api/collab/state?markId=${slug}`)
      const data = await res.json()
      if (data.ok && data.collab) {
        setCollab(data.collab)
        setProposal(data.openProposal)
      }
    } catch (err) {
      console.error('Failed to load collab state:', err)
    } finally {
      setLoading(false)
    }
  }
  
  async function handleSubmit() {
    if (!diff.trim() || !summary.trim() || !collab) return
    
    setSubmitting(true)
    try {
      const res = await fetch('/api/collab/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collabId: collab.id,
          diff: [{ path: 'app', after: diff }],
          summary,
          userId: user?.id || 'guest'
        })
      })
      const data = await res.json()
      
      if (data.ok) {
        setDiff('')
        setSummary('')
        loadState()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (err) {
      alert('Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }
  
  async function handleVote(decision: 'merge' | 'revert') {
    if (!proposal || !collab) return
    
    setVoting(true)
    try {
      const res = await fetch('/api/collab/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collabId: collab.id,
          proposalId: proposal.id,
          decision,
          userId: user?.id || 'guest'
        })
      })
      const data = await res.json()
      
      if (data.ok) {
        loadState()
        if (data.merged) {
          alert('✓ Changes merged!')
        } else if (data.reverted) {
          alert('Changes reverted')
        }
      } else {
        alert('Error: ' + data.error)
      }
    } catch (err) {
      alert('Failed to vote')
    } finally {
      setVoting(false)
    }
  }
  
  if (loading) {
    return (
      <main className="min-h-dvh p-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass p-8 text-center">
            <p className="text-text-secondary text-ui">Loading collaboration workspace...</p>
          </div>
        </div>
      </main>
    )
  }
  
  if (!collab) {
    return (
      <main className="min-h-dvh p-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass p-8 text-center">
            <p className="text-text-secondary text-ui mb-4">No collaboration found</p>
            <a href="/" className="btn-primary inline-block">← Back to Home</a>
          </div>
        </div>
      </main>
    )
  }
  
  const isMyTurn = collab.turn.userId === user?.id
  const isParticipant = collab.participants.some(p => p.userId === user?.id)
  
  if (authLoading) {
    return (
      <main className="min-h-dvh p-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass p-8 text-center">
            <p className="text-text-secondary text-ui">Loading...</p>
          </div>
        </div>
      </main>
    )
  }
  
  if (!user) {
    return (
      <main className="min-h-dvh p-6">
        <div className="max-w-6xl mx-auto">
          <div className="glass p-8 text-center">
            <p className="text-text-secondary text-ui mb-4">Please log in to access collaborations</p>
            <a href="/login" className="btn-primary inline-block">Log In</a>
          </div>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-dvh p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h2 font-semibold text-text-primary">Collaboration Workspace</h1>
            <p className="text-text-secondary text-ui mt-1">{collab.markId}</p>
          </div>
          <a href={`/s/${collab.markId}`} className="text-ui text-text-secondary hover:text-accent-cyan">
            View Mark →
          </a>
        </div>
        
        {/* Participants */}
        <div className="glass p-4 flex items-center gap-4">
          {collab.participants.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-pink to-accent-cyan flex items-center justify-center text-xs font-bold text-text-primary">
                {p.userId.charAt(0).toUpperCase()}
              </div>
              <div className="text-ui text-text-primary font-medium">@{p.userId}</div>
              <span className="text-caption text-text-muted">{p.role}</span>
            </div>
          ))}
        </div>
        
        {/* Turn Banner */}
        <div className={`glass p-4 ${isMyTurn ? 'border-l-4 border-accent-cyan' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-h4 font-semibold text-text-primary mb-1">
                Round #{collab.turn.index} — @{collab.turn.userId}'s turn
              </div>
              <div className="text-caption text-text-secondary">
                {isMyTurn ? 'It\'s your turn to make changes!' : 'Waiting for @{collab.turn.userId} to submit'}
              </div>
            </div>
            <div className="text-caption text-text-muted">
              Expires: {new Date(collab.turn.expiresAt).toLocaleString()}
            </div>
          </div>
        </div>
        
        {/* Proposal (if open) */}
        {proposal && (
          <div className="glass p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-h3 font-semibold text-text-primary">Open Proposal</h2>
              <span className="text-caption text-text-secondary">by @{proposal.by}</span>
            </div>
            <p className="text-text-secondary text-body">{proposal.summary}</p>
            
            {/* Diff Preview */}
            <div className="bg-black/30 rounded-lg p-4 font-mono text-caption text-text-muted overflow-x-auto">
              {proposal.diff.map((change, i) => (
                <div key={i} className="mb-2">
                  <div className="text-accent-cyan">File: {change.path}</div>
                  {change.after && <div className="ml-4 text-green-400">+{change.after}</div>}
                </div>
              ))}
            </div>
            
            {/* Vote Actions */}
            {isParticipant && (
              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleVote('merge')}
                  disabled={voting}
                  className="px-6 py-3 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 text-ui font-medium disabled:opacity-50"
                >
                  {voting ? 'Voting...' : '✓ Vote to Merge'}
                </button>
                <button
                  onClick={() => handleVote('revert')}
                  disabled={voting}
                  className="px-6 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-ui font-medium disabled:opacity-50"
                >
                  {voting ? 'Voting...' : '✗ Revert'}
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Edit Interface (if your turn) */}
        {isMyTurn && !proposal && (
          <div className="glass p-6 space-y-4">
            <h2 className="text-h3 font-semibold text-text-primary">Make Your Changes</h2>
            
            <div>
              <label className="block text-ui font-medium text-text-secondary mb-2">Summary</label>
              <textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Describe the changes you want to make..."
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none text-text-primary placeholder:text-text-muted"
                rows={2}
              />
            </div>
            
            <div>
              <label className="block text-ui font-medium text-text-secondary mb-2">Code Changes</label>
              <textarea
                value={diff}
                onChange={e => setDiff(e.target.value)}
                placeholder="// Your code changes here..."
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 font-mono text-caption text-text-primary placeholder:text-text-muted resize-none"
                rows={8}
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={submitting || !diff.trim() || !summary.trim()}
                className="px-6 py-3 rounded-xl bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30 text-ui font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Proposal'}
              </button>
              <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-ui text-text-primary">
                Request Changes
              </button>
            </div>
          </div>
        )}
        
        {/* Chat */}
        <div className="glass p-4">
          <h2 className="text-ui font-semibold text-text-primary mb-3">Chat & Notes</h2>
          <div className="space-y-2">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Send a message..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 outline-none text-text-primary placeholder:text-text-muted resize-none"
              rows={2}
            />
            <button className="px-4 py-2 rounded-lg bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30 text-caption font-medium">
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

