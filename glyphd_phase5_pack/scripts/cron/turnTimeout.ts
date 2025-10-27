async function run(){const now=Date.now();console.log('[cron] turnTimeout',new Date(now).toISOString())/* TODO */}run().catch(e=>{console.error(e);process.exit(1)})
