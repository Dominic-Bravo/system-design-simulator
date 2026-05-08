import { useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from 'reactflow'
import type { Node, Edge, Connection, ReactFlowInstance } from 'reactflow'
import 'reactflow/dist/style.css'
import { useGraphStore } from '../stores/graphStore'
import type { GraphNode } from '../simulation/types'
import { GraphNodeView } from './GraphNodeView'
import { GraphEdgeView } from './GraphEdgeView'

const nodeW = 190
const nodeH = 62

function layoutNodes(nodes: GraphNode[]): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {}
  let i = 0
  for (const n of nodes) {
    positions[n.id] = { x: (i % 2) * 320, y: Math.floor(i / 2) * 120 }
    i++
  }
  return positions
}

export function BuilderCanvas({
  selectedId,
  onSelectNode,
}: {
  selectedId: string | null
  onSelectNode: (id: string) => void
}) {
  const model = useGraphStore((s) => s.model)
  const addEdge = useGraphStore((s) => s.addEdge)

  const [rf, setRf] = useState<ReactFlowInstance | null>(null)

  const { nodes, edges } = useMemo(() => {
    const pos = layoutNodes(model.nodes)

    const rfNodes: Node[] = model.nodes.map((n, idx) => ({
      id: n.id,
      type: 'graphNode',
      position: pos[n.id] ?? { x: idx * 220, y: 0 },
      data: {
        node: n,
        isSelected: selectedId === n.id,
      },
      style: {
        width: nodeW,
        height: nodeH,
      },
    }))

    const rfEdges: Edge[] = model.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'graphEdge',
      animated: false,
      data: {
        edge: e,
      },
    }))

    return { nodes: rfNodes, edges: rfEdges }
  }, [model.nodes, model.edges, selectedId])

  // Keep viewport stable on reload; minimal effort for Phase 1.
  useEffect(() => {
    if (!rf) return
    // no-op
  }, [rf])

  const onConnect = (connection: Connection) => {
    if (!connection.source || !connection.target) return
    addEdge(connection.source, connection.target)
  }

  const nodeTypes = useMemo(() => ({ graphNode: GraphNodeView }), [])
  const edgeTypes = useMemo(() => ({ graphEdge: GraphEdgeView }), [])

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', height: 'calc(100svh - 24px)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={() => {
          // Phase 1: positions are derived from simple layout.
          // Future: persist positions.
        }}
        onEdgesChange={() => {
          // Phase 1: edge deletion not yet exposed.
        }}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={setRf}
        fitView
        onNodeClick={(_, node) => onSelectNode(node.id)}
        onPaneClick={() => {
          // no-op
        }}
      >
        <Background gap={18} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  )
}

