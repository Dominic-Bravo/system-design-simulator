export type NodeType =
  | 'client'
  | 'cdn'
  | 'dns'
  | 'load_balancer'
  | 'api_gateway'
  | 'api'
  | 'auth_service'
  | 'web_app'
  | 'worker'
  | 'database'
  | 'read_replica'
  | 'cache'
  | 'search'
  | 'object_storage'
  | 'queue'
  | 'stream'
  | 'notification'
  | 'payment'
  | 'third_party_api'
  | 'monitoring'

export type GraphNode = {
  id: string
  type: NodeType
  name: string
  position?: {
    x: number
    y: number
  }
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

