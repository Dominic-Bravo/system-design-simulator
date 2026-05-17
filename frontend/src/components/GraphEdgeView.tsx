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
}: EdgeProps<{ edge: GraphEdge; isActive: boolean }>) {
  const latency = data?.edge?.config?.latencyMs ?? 0
  const isActive = data?.isActive ?? false
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return (
    <g className={isActive ? 'flow-edge active' : 'flow-edge'}>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: isActive ? '#14b8a6' : '#9ca3af',
          strokeWidth: isActive ? 4 : 2,
        }}
      />
      {isActive ? <circle r="6" className="packet-dot"><animateMotion dur="0.85s" repeatCount="indefinite" path={edgePath} /></circle> : null}
      <EdgeLabelRenderer>
        <div
          className={isActive ? 'edge-label active' : 'edge-label'}
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
        >
          {latency}ms
        </div>
      </EdgeLabelRenderer>
    </g>
  )
}
