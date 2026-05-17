import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { GraphNode } from '../simulation/types'

const nodeLabels: Record<GraphNode['type'], string> = {
  api: 'API',
  database: 'DB',
  cache: 'CACHE',
  queue: 'QUEUE',
  load_balancer: 'LB',
}

export function GraphNodeView({
  data,
}: NodeProps<{ node: GraphNode; isSelected: boolean; isActive: boolean; isConnectSource: boolean; isInPath: boolean }>) {
  const { node, isSelected, isActive, isConnectSource, isInPath } = data
  const latency = typeof node.config?.latencyMs === 'number' ? node.config.latencyMs : 0

  return (
    <div className={`graph-node ${isSelected ? 'selected' : ''} ${isActive ? 'active' : ''} ${isConnectSource ? 'connect-source' : ''} ${isInPath ? 'in-path' : ''}`}>
      <Handle type="target" position={Position.Left} className="node-handle" />
      <div className="node-badge">{nodeLabels[node.type]}</div>
      <div className="node-body">
        <strong>{node.name}</strong>
        <span>{latency}ms latency</span>
      </div>
      {isActive ? <div className="data-pulse" /> : null}
      <Handle type="source" position={Position.Right} className="node-handle" />
    </div>
  )
}
