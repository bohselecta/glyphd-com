import fs from 'fs'
import path from 'path'

export type BuilderEvent = 
  | { type: 'like'; by: string; markId: string; ts: number }
  | { type: 'comment'; by: string; markId: string; helpful?: boolean; ts: number }
  | { type: 'collab.accepted'; markId: string; ts: number }
  | { type: 'collab.merge'; markId: string; ts: number }
  | { type: 'featured'; markId: string; ts: number }
  | { type: 'collab.abandoned'; markId: string; ts: number }

export interface BuilderPoints {
  username: string
  points: number
  likes: number
  comments: number
  merges: number
  acceptedCollabs: number
  featured: number
  abandoned: number
  lastUpdated: string
}

const POINTS_DIR = path.join(process.cwd(), 'apps/web/public/builders')
const EVENTS_DIR = path.join(process.cwd(), 'apps/web/public/builders/events')

export function getPointsFromEvent(e: BuilderEvent): number {
  switch (e.type) {
    case 'like': return 1
    case 'comment': return e.helpful ? 0.5 : 0
    case 'collab.accepted': return 2
    case 'collab.merge': return 3
    case 'featured': return 10
    case 'collab.abandoned': return -1
    default: return 0
  }
}

export function getBuilderPoints(username: string): BuilderPoints {
  const file = path.join(POINTS_DIR, `${username}.json`)
  
  if (!fs.existsSync(file)) {
    return {
      username,
      points: 0,
      likes: 0,
      comments: 0,
      merges: 0,
      acceptedCollabs: 0,
      featured: 0,
      abandoned: 0,
      lastUpdated: new Date().toISOString()
    }
  }
  
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

export function addEvent(event: BuilderEvent) {
  // Ensure directories exist
  if (!fs.existsSync(EVENTS_DIR)) {
    fs.mkdirSync(EVENTS_DIR, { recursive: true })
  }
  
  // Append event to events file
  const eventsFile = path.join(EVENTS_DIR, 'events.json')
  const events: BuilderEvent[] = fs.existsSync(eventsFile)
    ? JSON.parse(fs.readFileSync(eventsFile, 'utf-8'))
    : []
  
  events.push(event)
  fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2))
  
  // Update aggregated points
  const data = getBuilderPoints(event.by)
  const points = getPointsFromEvent(event)
  
  data.points += points
  
  switch (event.type) {
    case 'like':
      data.likes += 1
      break
    case 'comment':
      data.comments += 0.5
      break
    case 'collab.merge':
      data.merges += 1
      break
    case 'collab.accepted':
      data.acceptedCollabs += 1
      break
    case 'featured':
      data.featured += 1
      break
    case 'collab.abandoned':
      data.abandoned += 1
      break
  }
  
  data.lastUpdated = new Date().toISOString()
  
  if (!fs.existsSync(POINTS_DIR)) {
    fs.mkdirSync(POINTS_DIR, { recursive: true })
  }
  
  const file = path.join(POINTS_DIR, `${event.by}.json`)
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
  
  return data
}

export function calculateReputation(user: BuilderPoints): number {
  const activityScore = user.likes + user.comments * 0.5
  const collabScore = user.merges * 3 + user.acceptedCollabs * 2
  const featuredBonus = user.featured * 10
  const penalty = user.abandoned * -1
  const total = activityScore + collabScore + featuredBonus + penalty
  
  // Recent activity boost (last 30 days)
  const recentBoost = 1.1
  return Math.round(total * recentBoost)
}

// Backfill function to recompute points from events
export function backfillPoints() {
  const eventsFile = path.join(EVENTS_DIR, 'events.json')
  
  if (!fs.existsSync(eventsFile)) return
  
  const events: BuilderEvent[] = JSON.parse(fs.readFileSync(eventsFile, 'utf-8'))
  const pointsMap: Record<string, number> = {}
  
  for (const event of events) {
    if (!pointsMap[event.by]) {
      pointsMap[event.by] = 0
    }
    pointsMap[event.by] += getPointsFromEvent(event)
  }
  
  // Write computed points
  for (const [username, points] of Object.entries(pointsMap)) {
    const file = path.join(POINTS_DIR, `${username}.json`)
    const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : { username, points: 0 }
    existing.points = points
    existing.lastUpdated = new Date().toISOString()
    fs.writeFileSync(file, JSON.stringify(existing, null, 2))
  }
}

