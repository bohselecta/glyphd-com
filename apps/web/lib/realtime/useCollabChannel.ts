'use client'
import { useEffect, useRef } from 'react'
import { createClient } from '../supabase/client'

type Handler = (payload: any) => void

export function useCollabChannel(collabId: string) {
  const handlers = useRef<Record<string, Handler[]>>({})
  const channelRef = useRef<any>(null)
  
  function on(ev: string, fn: Handler) {
    handlers.current[ev] = handlers.current[ev] || []
    handlers.current[ev].push(fn)
    
    return () => {
      handlers.current[ev] = (handlers.current[ev] || []).filter(x => x !== fn)
    }
  }
  
  function emit(ev: string, payload: any) {
    (handlers.current[ev] || []).forEach(fn => fn(payload))
  }
  
  useEffect(() => {
    const supabase = createClient()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`collab:${collabId}`)
      .on('broadcast', { event: '*' }, ({ payload }) => {
        emit(payload.event, payload.data)
      })
      .subscribe()
    
    channelRef.current = channel
    
    return () => {
      channel.unsubscribe()
    }
  }, [collabId])
  
  return { on, emit }
}

