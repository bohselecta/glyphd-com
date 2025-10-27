/**
 * Cron job to recompute builder points from events
 * Run nightly
 */

async function run() {
  console.log('[cron] reputationBackfill', new Date().toISOString())
  
  const { backfillPoints } = await import('../../packages/core/builder_points')
  backfillPoints()
  
  console.log('[cron] reputationBackfill complete')
}

run().catch(e => {
  console.error('[cron] reputationBackfill error:', e)
  process.exit(1)
})

