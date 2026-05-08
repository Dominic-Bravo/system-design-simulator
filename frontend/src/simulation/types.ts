export type NodeType = 'api' | 'database' | 'cache' | 'queue' | 'load_balancer'

export type GraphNode = {
  id: string
  type: NodeType
  name: string
  config: Record<string, number | string | boolean>
}

export type GraphEdge = {
  id: string
  source: string
  target: string
  config: {
    latencyMs?: number
  }
}

export type GraphModel = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

