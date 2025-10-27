type RecordItem = { timestamp: string, model: string, inputTokens: number, outputTokens: number, approxCost: number, task?: string }
let memory: RecordItem[] = []

export function trackUsage(entry: RecordItem) {
  memory.push(entry)
  if (memory.length > 5000) memory = memory.slice(-2000)
}

export function getUsageSummary() {
  const sum = memory.reduce((acc, it) => {
    acc.input += it.inputTokens
    acc.output += it.outputTokens
    acc.cost += it.approxCost
    return acc
  }, { input: 0, output: 0, cost: 0 })
  return { ...sum, samples: memory.length }
}

