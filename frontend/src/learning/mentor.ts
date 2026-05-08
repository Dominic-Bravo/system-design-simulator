import type { GraphModel } from '../simulation/types'
import type { SimulationResult } from '../simulation/engine'

export type MentorAdvice = {
  title: string
  keyFindings: string[]
  suggestions: string[]
}

export function generateMentorAdvice(model: GraphModel, bench: SimulationResult): MentorAdvice {
  const nodeTypesPresent = new Set(model.nodes.map((n) => n.type))

  const bottlenecks = bench.bottleneckNodeIds
  const topBottleneck = bottlenecks[0]

  const findings: string[] = []
  const suggestions: string[] = []

  if (bench.processedRequests <= 0) {
    return {
      title: 'Add a graph and run simulation',
      keyFindings: ['Build a system (nodes + connections), then run the simulation to get metrics.'],
      suggestions: ['Try adding a Database node and connecting API -> Database.'],
    }
  }

  findings.push(`Observed average latency ${bench.avgLatencyMs.toFixed(1)}ms with p95 ${bench.p95LatencyMs.toFixed(1)}ms.`)

  if (topBottleneck) {
    findings.push(`Likely bottleneck near node: ${topBottleneck}. (MVP heuristic based on traversal frequency.)`)
  }

  if (bench.p95LatencyMs > bench.avgLatencyMs * 1.5) {
    findings.push('Tail latency looks elevated (p95 significantly higher than avg).')
  }

  if (nodeTypesPresent.has('database') && !nodeTypesPresent.has('cache')) {
    suggestions.push('Consider adding a Cache (Redis) in front of the Database to reduce repeat reads.')
  }

  if (nodeTypesPresent.has('queue')) {
    suggestions.push('If you add traffic spikes, queues help absorb bursts and smooth downstream load.')
  } else {
    suggestions.push('Consider adding a Queue if your workload needs to handle spikes or expensive operations.')
  }

  // Generic improvement suggestion
  suggestions.push('Try adding a Load Balancer before stateful services when you want horizontal scaling.')

  return {
    title: 'Mentor recommendations (Phase 3)',
    keyFindings: findings,
    suggestions,
  }
}

