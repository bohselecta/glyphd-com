// Realtime server utilities for Supabase

export async function broadcast(channel: string, event: string, data: any) {
  const { createClient } = await import('../supabase/server')
  const supabase = await createClient()
  
  const channelName = typeof channel === 'string' ? channel : `channel_${Math.random().toString(36).substring(7)}`
  
  return supabase
    .channel(channelName)
    .send({ 
      type: 'broadcast', 
      event, 
      payload: { event, data } 
    })
    .then(() => {
      console.log(`[realtime] Broadcast to ${channelName}:${event}`)
    })
    .catch(err => {
      console.error('[realtime] Broadcast failed:', err)
    })
}

export async function subscribe(
  channel: string, 
  callback: (event: string, data: any) => void
) {
  const { createClient } = await import('../supabase/server')
  const supabase = await createClient()
  
  const channelName = typeof channel === 'string' ? channel : `channel_${Math.random().toString(36).substring(7)}`
  
  const chan = supabase.channel(channelName)
  
  chan.on('broadcast', { event: '*' }, ({ payload }) => {
    if (payload?.event && payload?.data) {
      callback(payload.event, payload.data)
    }
  })
  
  chan.subscribe()
  
  console.log(`[realtime] Subscribed to ${channelName}`)
  
  return () => {
    chan.unsubscribe()
    console.log(`[realtime] Unsubscribed from ${channelName}`)
  }
}

