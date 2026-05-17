import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { GraphNode } from '../simulation/types'
import { nodeDefinitionByType } from '../simulation/nodeCatalog'

export function GraphNodeView({
  data,
}: NodeProps<{ node: GraphNode; isSelected: boolean; isActive: boolean; isConnectSource: boolean; isInPath: boolean }>) {
  const { node, isSelected, isActive, isConnectSource, isInPath } = data
  const definition = nodeDefinitionByType[node.type]
  const latency = typeof node.config?.latencyMs === 'number' ? node.config.latencyMs : 0

  return (
    <div className={`graph-node ${isSelected ? 'selected' : ''} ${isActive ? 'active' : ''} ${isConnectSource ? 'connect-source' : ''} ${isInPath ? 'in-path' : ''}`}>
      <Handle type="target" position={Position.Left} className="node-handle" />
      <div className="node-badge">{definition.shortLabel}</div>
      <div className="node-body">
        <strong>{node.name}</strong>
        <span>{latency}ms | {definition.category}</span>
      </div>
      {isActive ? <div className="data-pulse" /> : null}
      <Handle type="source" position={Position.Right} className="node-handle" />
    </div>
  )
}
