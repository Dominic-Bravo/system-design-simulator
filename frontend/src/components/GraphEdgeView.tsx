import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow'
import type { EdgeProps } from 'reactflow'
import type { GraphEdge } from '../simulation/types'

export function GraphEdgeView({
  data,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected,
}: EdgeProps<{ edge: GraphEdge }>) {
  const latency = data?.edge?.config?.latencyMs
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return (
    <g>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? 'var(--accent)' : 'var(--border)',
          strokeWidth: selected ? 3 : 2,
        }}
      />
      {latency !== undefined && latency > 0 ? (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              fontSize: 12,
              fontFamily: 'var(--mono)',
              color: 'var(--text-h)',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              padding: '2px 6px',
              pointerEvents: 'none',
            }}
          >
            {latency}ms
          </div>
        </EdgeLabelRenderer>
      ) : null}
      <title>{latency !== undefined ? `edge latency ${latency}ms` : 'edge'}</title>
    </g>
  )
}
