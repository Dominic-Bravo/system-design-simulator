import { create } from 'zustand'
import type { GraphEdge, GraphModel, GraphNode, NodeType } from '../simulation/types'

const STORAGE_KEY = 'sds_graph_v1'

const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16)

function defaultNode(type: NodeType): GraphNode {
  const base: Omit<GraphNode, 'id'> = {
    type,
    name:
      type === 'api'
        ? 'API'
        : type === 'database'
          ? 'Database'
          : type === 'cache'
            ? 'Cache (Redis)'
            : type === 'queue'
              ? 'Queue'
              : 'Load Balancer',
    config: {},
  }

  // Minimal per-node config used by Phase 1 request traversal.
  const config: GraphNode['config'] = {}

  if (type === 'api') config.latencyMs = 5
  if (type === 'database') config.latencyMs = 25
  if (type === 'cache') config.latencyMs = 2
  if (type === 'queue') config.latencyMs = 10
  if (type === 'load_balancer') config.latencyMs = 1

  return { id: uid(), ...base, config }
}

function loadInitial(): GraphModel {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { nodes: [], edges: [] }
    const parsed = JSON.parse(raw) as GraphModel
    if (!parsed?.nodes || !parsed?.edges) return { nodes: [], edges: [] }
    return parsed
  } catch {
    return { nodes: [], edges: [] }
  }
}

export const useGraphStore = create<{
  model: GraphModel
  setModel: (m: GraphModel) => void
  reset: () => void
  addNode: (type: NodeType) => string
  updateNode: (id: string, patch: Partial<GraphNode>) => void
  removeNode: (id: string) => void
  addEdge: (source: string, target: string) => void
  removeEdge: (id: string) => void
  save: () => void
  load: () => void
}>(() => ({
  model: { nodes: [], edges: [] },
  setModel: (m) => {
    useGraphStore.setState({ model: m })
  },
  reset: () => {
    const m: GraphModel = { nodes: [], edges: [] }
    useGraphStore.setState({ model: m })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(m))
  },
  addNode: (type) => {
    const node = defaultNode(type)
    const m = { ...useGraphStore.getState().model, nodes: [...useGraphStore.getState().model.nodes, node] }
    useGraphStore.setState({ model: m })
    return node.id
  },
  updateNode: (id, patch) => {
    const m = useGraphStore.getState().model
    const nodes = m.nodes.map((n) => (n.id === id ? { ...n, ...patch, config: { ...n.config, ...(patch.config ?? {}) } } : n))
    useGraphStore.setState({ model: { ...m, nodes } })
  },
  removeNode: (id) => {
    const m = useGraphStore.getState().model
    const nodes = m.nodes.filter((n) => n.id !== id)
    const edges = m.edges.filter((e) => e.source !== id && e.target !== id)
    useGraphStore.setState({ model: { nodes, edges } })
  },
  addEdge: (source, target) => {
    const m = useGraphStore.getState().model
    const id = uid()
    const edge: GraphEdge = { id, source, target, config: { latencyMs: 0 } }
    useGraphStore.setState({ model: { ...m, edges: [...m.edges, edge] } })
  },
  removeEdge: (id) => {
    const m = useGraphStore.getState().model
    useGraphStore.setState({ model: { ...m, edges: m.edges.filter((e) => e.id !== id) } })
  },
  save: () => {
    const m = useGraphStore.getState().model
    localStorage.setItem(STORAGE_KEY, JSON.stringify(m))
  },
  load: () => {
    const m = loadInitial()
    useGraphStore.setState({ model: m })
  },
}))

// Hydrate on first load (client-only)
useGraphStore.getState().load()

