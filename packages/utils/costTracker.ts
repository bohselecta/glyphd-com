import { ZAI_MODELS, ZaiModelKey } from '../../config/zaiModels'

export type UsageSample = { inputTokens?: number, outputTokens?: number }
export type CostBreakdown = { inputCost: number, outputCost: number, total: number }

export function estimateCost(model: ZaiModelKey, usage: UsageSample): CostBreakdown {
  const cfg = ZAI_MODELS[model]
  const inTok = usage.inputTokens || 0
  const outTok = usage.outputTokens || 0
  const inputCost = (inTok / 1_000_000) * cfg.inputPerM
  const outputCost = (outTok / 1_000_000) * cfg.outputPerM
  return { inputCost, outputCost, total: inputCost + outputCost }
}

