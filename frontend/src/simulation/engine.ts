import type { GraphModel, GraphNode, GraphEdge } from './types'

export type SimulationResult = {
  avgLatencyMs: number
  p95LatencyMs: number
  processedRequests: number
  bottleneckNodeIds: string[]
  pathNodeIds: string[]
  pathEdgeIds: string[]
}

function getNodeLatencyMs(node: GraphNode) {
  const v = node.config?.latencyMs
  return typeof v === 'number' ? v : 0
}

function edgeLatencyMs(edge: GraphEdge) {
  const v = edge.config?.latencyMs
  return typeof v === 'number' ? v : 0
}

function buildAdj(model: GraphModel) {
  const adj: Record<string, GraphEdge[]> = {}
  for (const e of model.edges) {
    adj[e.source] ??= []
    adj[e.source].push(e)
  }
  return adj
}

// Phase 2 (Basic Simulation):
// - Generate request paths by walking the graph from the leftmost "API" (or first node).
// - Deterministic first-edge walk (no load balancing yet; LB support can be added later).
// - Compute total latency as sum(node latency + edge latency).
function simulateOnce(model: GraphModel, startNodeId: string, maxHops = 30): { latencyMs: number; path: string[]; edgePath: string[] } {
  const nodeById: Record<string, GraphNode> = Object.fromEntries(model.nodes.map((n) => [n.id, n]))
  const adj = buildAdj(model)

  let curr = startNodeId
  const path: string[] = [curr]
  const edgePath: string[] = []
  let total = 0

  for (let hop = 0; hop < maxHops; hop++) {
    const node = nodeById[curr]
    if (!node) break

    // Add node processing latency.
    total += getNodeLatencyMs(node)

    const outgoing = adj[curr] ?? []
    if (outgoing.length === 0) {
      // request ends
      break
    }

    // Choose first edge for now (Phase 2a). Load balancer behavior can be added later.
    const e = outgoing[0]
    total += edgeLatencyMs(e)
    edgePath.push(e.id)
    curr = e.target

    path.push(curr)
  }

  return { latencyMs: total, path, edgePath }
}

function percentile(sorted: number[], p: number) {
  if (sorted.length === 0) return 0
  const idx = Math.max(0, Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1))
  return sorted[idx] ?? 0
}

function findStartNodeId(model: GraphModel) {
  const targets = new Set(model.edges.map((e) => e.target))
  const entryNodes = model.nodes.filter((n) => !targets.has(n.id))
  const candidates = entryNodes.length > 0 ? entryNodes : model.nodes
  const preferred =
    candidates.find((n) => n.type === 'client') ??
    candidates.find((n) => n.type === 'dns') ??
    candidates.find((n) => n.type === 'cdn') ??
    candidates.find((n) => n.type === 'load_balancer') ??
    candidates.find((n) => n.type === 'api_gateway') ??
    candidates.find((n) => n.type === 'api')

  return preferred?.id ?? candidates[0]?.id ?? model.nodes[0].id
}

export function runBasicSimulation(model: GraphModel, trafficRps: number): SimulationResult {
  if (model.nodes.length === 0) {
    return { avgLatencyMs: 0, p95LatencyMs: 0, processedRequests: 0, bottleneckNodeIds: [], pathNodeIds: [], pathEdgeIds: [] }
  }

  // Phase 2: we interpret trafficRps as request count for one simulation tick.
  const processedRequests = Math.max(1, Math.min(trafficRps, 1000))

  const startNodeId = findStartNodeId(model)

  const latencies: number[] = []
  const visits: Record<string, number> = {}
  let pathNodeIds: string[] = []
  let pathEdgeIds: string[] = []

  for (let i = 0; i < processedRequests; i++) {
    const { latencyMs, path, edgePath } = simulateOnce(model, startNodeId)
    latencies.push(latencyMs)
    if (i === 0) {
      pathNodeIds = path
      pathEdgeIds = edgePath
    }
    for (const nodeId of path) {
      visits[nodeId] = (visits[nodeId] ?? 0) + 1
    }
  }

  const sorted = [...latencies].sort((a, b) => a - b)
  const avgLatencyMs = sorted.reduce((s, v) => s + v, 0) / sorted.length
  const p95LatencyMs = percentile(sorted, 95)

  // Bottleneck heuristic: nodes with highest visit count.
  // (Later: bottleneck by queue buildup / saturation.)
  const sortedVisits = Object.entries(visits).sort((a, b) => b[1] - a[1])
  const bottleneckNodeIds = sortedVisits.slice(0, 2).map(([id]) => id)

  return { avgLatencyMs, p95LatencyMs, processedRequests, bottleneckNodeIds, pathNodeIds, pathEdgeIds }
}

