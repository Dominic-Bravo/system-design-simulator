import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { GraphNode } from '../simulation/types'

export function GraphNodeView({ data }: NodeProps<{ node: GraphNode; isSelected: boolean }>) {
  const { node, isSelected } = data

  const latency = typeof node.config?.latencyMs === 'number' ? node.config.latencyMs : undefined

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 10,
        border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
        background: 'rgba(255,255,255,0.65)',
        padding: 10,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-h)' }}>{node.name}</div>
      <div style={{ fontSize: 12, opacity: 0.9 }}>
        {latency !== undefined ? `latency: ${latency}ms` : node.type}
      </div>

      {/* Input/output handles */}
      <Handle type="target" position={Position.Left} style={{ background: 'var(--accent)' }} />
      <Handle type="source" position={Position.Right} style={{ background: 'var(--accent)' }} />
    </div>
  )
}

