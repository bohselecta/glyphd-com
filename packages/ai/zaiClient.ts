import type { PlanType, ZaiModelKey } from '../../config/zaiModels'
import { resolveModelForTask, ZAI_MODELS } from '../../config/zaiModels'
import { estimateCost } from '../utils/costTracker'
import { trackUsage } from '../utils/usageTracker'

type Message = { role: 'system'|'user'|'assistant', content: string }
type ChatOptions = {
  apiKey?: string
  baseUrl?: string
  path?: string
  model?: ZaiModelKey
  planType?: PlanType
  task?: 'copy'|'mapping'|'refine'|'assist'|'critique'
  logCost?: boolean
}

export async function chatZAI(messages: Message[], opts: ChatOptions = {}) {
  const apiKey = opts.apiKey || process.env.ZAI_API_KEY || ''
  const baseUrl = (opts.baseUrl || process.env.ZAI_BASE_URL || 'https://api.z.ai').replace(/\/$/, '')
  const path = opts.path || process.env.ZAI_CHAT_PATH || '/api/paas/v4/chat/completions'
  const plan: PlanType = opts.planType || (process.env.ZAI_PLAN_TYPE as PlanType) || (process.env.GLYPHD_MODE==='local' ? 'CODING_LITE' : 'API_STANDARD')
  const model: ZaiModelKey = opts.model || resolveModelForTask(plan, opts.task || 'mapping')

  if (!apiKey) {
    throw new Error('ZAI_API_KEY is not set. Please configure it in /settings/keys')
  }

  const url = `${baseUrl}${path}`

  const body = {
    model,
    messages,
    temperature: 0.7,
    top_p: 0.9,
    stream: false
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const text = await res.text().catch(()=> '')
    throw new Error(`ZAI_HTTP_${res.status}: ${text || res.statusText}`)
  }

  // Attempt to parse a usage-like object
  const json = await res.json().catch(()=> ({} as any))
  const content = json?.choices?.[0]?.message?.content ?? ''
  const usage = json?.usage || json?.token_usage || {}
  const inputTokens = usage?.prompt_tokens || usage?.input_tokens || 0
  const outputTokens = usage?.completion_tokens || usage?.output_tokens || 0

  // cost log
  if (opts.logCost || process.env.ZAI_COST_TRACKING_ENABLED === 'true') {
    try {
      const est = estimateCost(model, { inputTokens, outputTokens })
      trackUsage({ timestamp: new Date().toISOString(), model, inputTokens, outputTokens, approxCost: est.total, task: opts.task })
    } catch {}
  }

  return { model, content, raw: json, usage: { inputTokens, outputTokens } }
}
