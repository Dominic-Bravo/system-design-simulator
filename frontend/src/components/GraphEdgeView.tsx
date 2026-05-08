import type { EdgeProps } from 'reactflow'
import type { GraphEdge } from '../simulation/types'

export function GraphEdgeView({ data }: EdgeProps<{ edge: GraphEdge }>) {
  const latency = data?.edge?.config?.latencyMs
  // Use default edge rendering path by not overriding; keep minimal custom look in Phase 1.
  return (
    <g>
      {/* reactflow will render the actual path via its internals; keeping this as a placeholder is okay for Phase 1 */}
      {/* If ReactFlow complains, we’ll switch to using the built-in 'smoothstep'/'default' edge types. */}
      <title>{latency !== undefined ? `edge latency ${latency}ms` : 'edge'}</title>
    </g>
  )
}

