import { useEffect, useRef, useState } from 'react'
import type { GraphNode } from '../simulation/types'
import { nodeDefinitionByType } from '../simulation/nodeCatalog'

export function NodeConfigModal({
  node,
  nodes,
  outgoingNodeIds,
  onClose,
  onUpdateNode,
  onAddConnection,
  onRemoveConnection,
  onDeleteNode,
}: {
  node: GraphNode
  nodes: GraphNode[]
  outgoingNodeIds: string[]
  onClose: () => void
  onUpdateNode: (patch: Partial<GraphNode>) => void
  onAddConnection: (targetId: string) => void
  onRemoveConnection: (targetId: string) => void
  onDeleteNode: () => void
}) {
  const definition = nodeDefinitionByType[node.type]
  const dragOffset = useRef({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: Math.max(360, window.innerWidth - 470), y: 96 })
  const availableTargets = nodes.filter((candidate) => candidate.id !== node.id && !outgoingNodeIds.includes(candidate.id))
  const connectedTargets = outgoingNodeIds
    .map((id) => nodes.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is GraphNode => Boolean(candidate))

  useEffect(() => {
    if (!isDragging) return

    const onPointerMove = (event: PointerEvent) => {
      const nextX = Math.max(8, Math.min(window.innerWidth - 260, event.clientX - dragOffset.current.x))
      const nextY = Math.max(8, Math.min(window.innerHeight - 120, event.clientY - dragOffset.current.y))
      setPosition({ x: nextX, y: nextY })
    }

    const onPointerUp = () => setIsDragging(false)

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [isDragging])

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="node-modal"
        role="dialog"
        aria-modal="false"
        aria-label="Configure node"
        style={{ left: position.x, top: position.y }}
      >
        <header
          className="modal-header draggable"
          onPointerDown={(event) => {
            dragOffset.current = { x: event.clientX - position.x, y: event.clientY - position.y }
            setIsDragging(true)
          }}
        >
          <div>
            <span>{definition.category}</span>
            <h2>{definition.label}</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Close" onPointerDown={(e) => e.stopPropagation()} onClick={onClose}>x</button>
        </header>

        <div className="modal-body">
          <label className="field">
            <span>Name</span>
            <input value={node.name} onChange={(e) => onUpdateNode({ name: e.target.value })} />
          </label>

          <div className="config-grid">
            {definition.fields.map((field) => {
              const value = node.config[field.key]

              if (field.type === 'boolean') {
                return (
                  <label className="field checkbox-field" key={field.key}>
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(e) => onUpdateNode({ config: { [field.key]: e.target.checked } })}
                    />
                    <span>{field.label}</span>
                  </label>
                )
              }

              return (
                <label className="field" key={field.key}>
                  <span>{field.label}{field.suffix ? ` (${field.suffix})` : ''}</span>
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    min={field.type === 'number' ? 0 : undefined}
                    value={field.type === 'number' ? Number(value ?? 0) : String(value ?? '')}
                    onChange={(e) => {
                      const nextValue = field.type === 'number' ? Number(e.target.value) : e.target.value
                      onUpdateNode({ config: { [field.key]: nextValue } })
                    }}
                  />
                </label>
              )
            })}
          </div>

          <div className="connection-editor">
            <div className="section-heading">
              <span>Outgoing Connections</span>
              <small>Add or remove links. Drag nodes on the canvas to move them.</small>
            </div>

            <label className="field">
              <span>Add connection to</span>
              <select
                value=""
                disabled={availableTargets.length === 0}
                onChange={(e) => {
                  if (!e.target.value) return
                  onAddConnection(e.target.value)
                  e.currentTarget.value = ''
                }}
              >
                <option value="">{availableTargets.length ? 'Choose a node' : 'No available targets'}</option>
                {availableTargets.map((target) => (
                  <option value={target.id} key={target.id}>{target.name}</option>
                ))}
              </select>
            </label>

            <div className="connection-list">
              {connectedTargets.length ? (
                connectedTargets.map((target) => (
                  <div className="connection-row" key={target.id}>
                    <span>{node.name} -&gt; {target.name}</span>
                    <button type="button" onClick={() => onRemoveConnection(target.id)}>Remove</button>
                  </div>
                ))
              ) : (
                <div className="empty-state">No outgoing connections yet.</div>
              )}
            </div>
          </div>
        </div>

        <footer className="modal-actions">
          <button type="button" className="danger-button" onClick={onDeleteNode}>Delete node</button>
          <button type="button" className="primary-button compact" onClick={onClose}>Done</button>
        </footer>
      </section>
    </div>
  )
}
