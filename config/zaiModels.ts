export type ZaiModelKey = 'glm-4.6' | 'glm-4.5-air' | 'glm-4.5' | 'glm-4.5-flash'

export const ZAI_MODELS: Record<ZaiModelKey, { tier:'default'|'light'|'fallback'|'free', inputPerM:number, outputPerM:number, notes?:string }> = {
  'glm-4.6':       { tier: 'default',  inputPerM: 0.60, outputPerM: 2.20, notes: 'High quality; use for flagship copy & structure.' },
  'glm-4.5-air':   { tier: 'light',    inputPerM: 0.20, outputPerM: 1.10, notes: 'Cost-efficient; good for mapping & small edits.' },
  'glm-4.5':       { tier: 'fallback', inputPerM: 0.35, outputPerM: 1.50, notes: 'General fallback.' },
  'glm-4.5-flash': { tier: 'free',     inputPerM: 0.00, outputPerM: 0.00, notes: 'Free/limited; verify API availability & policy.' },
}

export type PlanType = 'CODING_LITE' | 'API_STANDARD' | 'UNKNOWN'

export function resolveModelForTask(plan: PlanType, task: 'copy'|'mapping'|'refine'|'assist'|'critique'): ZaiModelKey {
  // Coding Lite applies only to supported coding tools; for web API, treat as API_STANDARD unless policy changes.
  // We still select economical models by task.
  if (task === 'copy') return 'glm-4.6'
  if (task === 'mapping') return 'glm-4.5-air'
  if (task === 'refine') return 'glm-4.5-air'
  if (task === 'assist') return 'glm-4.5-air'
  if (task === 'critique') return 'glm-4.5-air'
  return 'glm-4.5-air'
}

