type KV = {
  incr: (key: string, ttlSec: number) => Promise<number>
}

// In-memory store for development (replace with Redis/Upstash in production)
const memory = new Map<string, { count: number; exp: number }>()

const memoryKV: KV = {
  async incr(key: string, ttlSec: number) {
    const now = Date.now()
    const item = memory.get(key)
    
    if (!item || item.exp < now) {
      memory.set(key, { count: 1, exp: now + ttlSec * 1000 })
      return 1
    } else {
      item.count += 1
      return item.count
    }
  }
}

export async function limit(
  key: string,
  windowSec: number,
  max: number,
  kv: KV = memoryKV
): Promise<boolean> {
  const count = await kv.incr(key, windowSec)
  return count <= max
}

