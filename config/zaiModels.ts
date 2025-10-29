// z.ai GLM Coding Plan models
export type ZaiModelKey = 'GLM-4.6' | 'GLM-4.5' | 'GLM-4.5-air'

export const ZAI_MODELS: Record<ZaiModelKey, { tier:'default'|'light'|'fallback'|'free', inputPerM:number, outputPerM:number, notes?:string }> = {
  'GLM-4.6':    { tier: 'default', inputPerM: 0.14, outputPerM: 0.28, notes: 'Standard, complex tasks. Best for code generation and debugging.' },
  'GLM-4.5':    { tier: 'default', inputPerM: 0.14, outputPerM: 0.28, notes: 'Standard model, good for general coding tasks.' },
  'GLM-4.5-air': { tier: 'light',   inputPerM: 0.14, outputPerM: 0.28, notes: 'Lightweight, faster response. Good for quick tasks.' },
}

export type PlanType = 'CODING_LITE' | 'API_STANDARD' | 'UNKNOWN'

export function resolveModelForTask(plan: PlanType, task: 'copy'|'mapping'|'refine'|'assist'|'critique'): ZaiModelKey {
  // Use GLM-4.6 for complex coding tasks, GLM-4.5 for standard tasks, GLM-4.5-air for lightweight tasks
  if (task === 'copy') return 'GLM-4.5'
  if (task === 'mapping') return 'GLM-4.6'
  if (task === 'refine') return 'GLM-4.6'
  if (task === 'assist') return 'GLM-4.5'
  if (task === 'critique') return 'GLM-4.5'
  return 'GLM-4.6'
}

