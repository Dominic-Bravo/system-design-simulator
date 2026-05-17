import { useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  applyNodeChanges,
} from 'reactflow'
import type { Node, Edge, Connection, NodeChange } from 'reactflow'
import 'reactflow/dist/style.css'
import { useGraphStore } from '../stores/graphStore'
import { GraphNodeView } from './GraphNodeView'
import { GraphEdgeView } from './GraphEdgeView'

const nodeW = 190
const nodeH = 72

export function BuilderCanvas({
  selectedId,
  activeNodeId,
  activeEdgeId,
  connectFromId,
  pathNodeIds,
  onSelectNode,
}: {
  selectedId: string | null
  activeNodeId?: string
  activeEdgeId?: string
  connectFromId: string | null
  pathNodeIds: string[]
  onSelectNode: (id: string | null) => void
}) {
  const model = useGraphStore((s) => s.model)
  const setModel = useGraphStore((s) => s.setModel)
  const addEdge = useGraphStore((s) => s.addEdge)

  const { nodes, edges } = useMemo(() => {
    const rfNodes: Node[] = model.nodes.map((n, idx) => ({
      id: n.id,
      type: 'graphNode',
      position: n.position ?? { x: 80 + (idx % 3) * 280, y: 80 + Math.floor(idx / 3) * 140 },
      width: nodeW,
      height: nodeH,
      data: {
        node: n,
        isSelected: selectedId === n.id || connectFromId === n.id,
        isActive: activeNodeId === n.id,
        isConnectSource: connectFromId === n.id,
        isInPath: pathNodeIds.includes(n.id),
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
      animated: activeEdgeId === e.id,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: activeEdgeId === e.id ? '#14b8a6' : '#9ca3af',
      },
      data: {
        edge: e,
        isActive: activeEdgeId === e.id,
      },
    }))

    return { nodes: rfNodes, edges: rfEdges }
  }, [activeEdgeId, activeNodeId, connectFromId, model.edges, model.nodes, pathNodeIds, selectedId])

  const onNodesChange = (changes: NodeChange[]) => {
    const positionChanges = changes.filter((change) => change.type === 'position')
    if (positionChanges.length === 0) return

    const updatedNodes = applyNodeChanges(positionChanges, nodes)
    const positions = new Map(updatedNodes.map((n) => [n.id, n.position]))
    setModel({
      ...model,
      nodes: model.nodes.map((n) => ({
        ...n,
        position: positions.get(n.id) ?? n.position,
      })),
    })
  }

  const onConnect = (connection: Connection) => {
    if (!connection.source || !connection.target) return
    addEdge(connection.source, connection.target)
  }

  const nodeTypes = useMemo(() => ({ graphNode: GraphNodeView }), [])
  const edgeTypes = useMemo(() => ({ graphEdge: GraphEdgeView }), [])

  return (
    <div className="canvas-shell">
      {model.nodes.length === 0 ? (
        <div className="canvas-empty">
          <h2>Start with a component</h2>
          <p>Add nodes from the left panel, connect them, then run the simulator.</p>
        </div>
      ) : null}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.24, maxZoom: 1 }}
        minZoom={0.35}
        maxZoom={1.2}
        onNodeClick={(_, node) => onSelectNode(node.id)}
        onPaneClick={() => onSelectNode(null)}
      >
        <Background gap={20} color="rgba(100,116,139,0.26)" />
        <MiniMap pannable zoomable nodeStrokeWidth={3} />
        <Controls />
      </ReactFlow>
    </div>
  )
}
