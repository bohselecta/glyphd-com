import { createClient } from './supabase/server'

export type Mark = {
  id: string
  slug: string
  title: string
  description?: string
  headline?: string
  sub?: string
  author_id?: string
  created_at: string
  updated_at?: string
  private: boolean
  feed_posted: boolean
  likes: number
  comments: number
  collab_requests: number
  hero_image_url?: string
  metadata?: any
  schema_data?: any
}

export type Profile = {
  id: string
  username?: string
  avatar_url?: string
  created_at: string
  builder_points: number
}

// Database operations
export async function getMark(slug: string): Promise<Mark | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('marks')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error || !data) return null
  return data as Mark
}

export async function getMarks(params?: {
  author_id?: string
  private?: boolean
  limit?: number
  offset?: number
}) {
  const supabase = await createClient()
  let query = supabase.from('marks').select('*')
  
  if (params?.author_id) {
    query = query.eq('author_id', params.author_id)
  }
  
  if (params?.private !== undefined) {
    query = query.eq('private', params.private)
  }
  
  if (params?.limit) {
    query = query.limit(params.limit)
  }
  
  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 20))
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  return { data: data || [], error }
}

export async function createMark(mark: Partial<Mark>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('marks')
    .insert({
      ...mark,
      author_id: user?.id
    })
    .select()
    .single()
  
  return { data, error }
}

export async function updateMark(id: string, updates: Partial<Mark>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('marks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error || !data) return null
  return data as Profile
}


