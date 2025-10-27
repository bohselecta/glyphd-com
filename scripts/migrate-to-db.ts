/**
 * Migration script: File-based storage → Supabase database
 * 
 * Usage: npx tsx scripts/migrate-to-db.ts
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials')
  console.log('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const SYMBOLS_DIR = path.join(process.cwd(), 'apps/web/public/symbols')

interface Metadata {
  title: string
  author: string
  description?: string
  heroImage?: string
  private?: boolean
  feedPosted?: boolean
  likes?: number
  comments?: number
  createdAt?: string
}

async function migrateMarks() {
  console.log('🚀 Starting migration...')
  
  if (!fs.existsSync(SYMBOLS_DIR)) {
    console.log('📁 No symbols directory found, skipping.')
    return
  }
  
  const slugs = fs.readdirSync(SYMBOLS_DIR)
  let migrated = 0
  let failed = 0
  
  for (const slug of slugs) {
    try {
      const metadataPath = path.join(SYMBOLS_DIR, slug, 'metadata.json')
      
      if (!fs.existsSync(metadataPath)) {
        console.log(`⚠️  Skipping ${slug}: no metadata.json`)
        continue
      }
      
      const metadata: Metadata = JSON.parse(
        fs.readFileSync(metadataPath, 'utf-8')
      )
      
      // Find or create author
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', metadata.author)
        .single()
      
      let authorId = existingProfile?.id
      
      if (!authorId) {
        // Create profile for author
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            username: metadata.author,
            avatar_url: null
          })
          .select()
          .single()
        
        if (newProfile) authorId = newProfile.id
      }
      
      // Insert mark
      const { error } = await supabase
        .from('marks')
        .insert({
          slug,
          title: metadata.title,
          description: metadata.description || metadata.title,
          headline: metadata.description,
          sub: metadata.description?.substring(0, 100),
          author_id: authorId,
          private: metadata.private || false,
          feed_posted: metadata.feedPosted || false,
          likes: metadata.likes || 0,
          comments: metadata.comments || 0,
          hero_image_url: metadata.heroImage || null,
          created_at: metadata.createdAt || new Date().toISOString()
        })
      
      if (error) {
        console.error(`❌ Failed to migrate ${slug}:`, error.message)
        failed++
      } else {
        console.log(`✅ Migrated ${slug}`)
        migrated++
      }
      
    } catch (e: any) {
      console.error(`❌ Error migrating ${slug}:`, e.message)
      failed++
    }
  }
  
  console.log(`\n✨ Migration complete:`)
  console.log(`   - Migrated: ${migrated}`)
  console.log(`   - Failed: ${failed}`)
}

async function main() {
  try {
    await migrateMarks()
  } catch (e: any) {
    console.error('Migration failed:', e.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { migrateMarks }

