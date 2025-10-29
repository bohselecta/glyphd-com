// DeepSeek v3.2-exp models
export type ZaiModelKey = 'deepseek-chat' | 'deepseek-reasoner' | 'deepseek-coder'

export const ZAI_MODELS: Record<ZaiModelKey, { tier:'default'|'light'|'fallback'|'free', inputPerM:number, outputPerM:number, notes?:string }> = {
  'deepseek-chat':     { tier: 'default', inputPerM: 0.14, outputPerM: 0.28, notes: 'Fast general purpose chat model.' },
  'deepseek-reasoner': { tier: 'default', inputPerM: 0.55, outputPerM: 2.19, notes: 'Enhanced reasoning with thinking mode.' },
  'deepseek-coder':    { tier: 'light',   inputPerM: 0.14, outputPerM: 0.28, notes: 'Optimized for code generation and programming tasks.' },
}

export type PlanType = 'CODING_LITE' | 'API_STANDARD' | 'UNKNOWN'

export function resolveModelForTask(plan: PlanType, task: 'copy'|'mapping'|'refine'|'assist'|'critique'): ZaiModelKey {
  // Use deepseek-coder for coding-related tasks, deepseek-chat for copy, deepseek-reasoner for complex tasks
  if (task === 'copy') return 'deepseek-chat'
  if (task === 'mapping') return 'deepseek-coder'
  if (task === 'refine') return 'deepseek-coder'
  if (task === 'assist') return 'deepseek-chat'
  if (task === 'critique') return 'deepseek-chat'
  return 'deepseek-coder'
}

