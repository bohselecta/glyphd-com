// In-memory demo; swap for DB
export type Usage = { tier: 'free'|'creator', month: { images: number, steps: number }, today: { apps: number, stepsByApp: Record<string, number>, imagesByApp: Record<string, number> }, stripe?: { customerId?: string, subscriptionId?: string } }
const store: Record<string, Usage> = {}
export async function getUsage(userId: string): Promise<Usage> { if (!store[userId]) store[userId] = { tier:'free', month:{images:0,steps:0}, today:{apps:0,stepsByApp:{},imagesByApp:{}} }; return store[userId] }
export async function setTier(userId: string, tier:'free'|'creator'){ const u=await getUsage(userId); u.tier=tier; return u }
export async function attachStripe(userId:string, customerId:string, subscriptionId?:string){ const u=await getUsage(userId); u.stripe={customerId,subscriptionId}; return u }
export async function seedCreatorCredits(userId:string){ const u=await getUsage(userId); u.month.images+=100; u.month.steps+=10000 }
export async function downgradeToFree(userId:string){ await setTier(userId,'free') }
export async function canUseBuildStep(userId:string, appSlug:string, limits:any){ const u=await getUsage(userId); const cap=limits[u.tier]; const used=u.today.stepsByApp[appSlug]||0; return used<cap.stepsPerAppPerDay }
export async function recordBuildStep(userId:string, appSlug:string){ const u=await getUsage(userId); u.today.stepsByApp[appSlug]=(u.today.stepsByApp[appSlug]||0)+1; u.month.steps+=1 }
export async function canUseImage(userId:string, appSlug:string, limits:any){ const u=await getUsage(userId); const cap=limits[u.tier]; const used=u.today.imagesByApp[appSlug]||0; if(used>=cap.imagesPerApp) return false; if(u.tier==='creator' && u.month.images>=limits.hardStops.monthlyImageMax) return false; if(u.tier==='creator' && u.month.images>=cap.monthlyImagePool) return false; return true }
export async function recordImage(userId:string, appSlug:string){ const u=await getUsage(userId); u.today.imagesByApp[appSlug]=(u.today.imagesByApp[appSlug]||0)+1; u.month.images+=1 }
