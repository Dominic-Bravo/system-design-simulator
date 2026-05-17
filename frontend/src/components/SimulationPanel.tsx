import { useMemo } from 'react'
import { useGraphStore } from '../stores/graphStore'
import type { SimulationResult } from '../simulation/engine'
import { nodeCatalog, nodeCategories, nodeDefinitionByType } from '../simulation/nodeCatalog'

function metric(value: number, suffix = '') {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}${suffix}`
}

export function SimulationPanel({
  selectedId,
  trafficRps,
  result,
  isRunning,
  connectFromId,
  onTrafficChange,
  onRunSimulation,
  onStartConnection,
  onCancelConnection,
  onSelectNode,
  onClearResult,
}: {
  selectedId: string | null
  trafficRps: number
  result: SimulationResult
  isRunning: boolean
  connectFromId: string | null
  onTrafficChange: (value: number) => void
  onRunSimulation: () => void
  onStartConnection: (id: string) => void
  onCancelConnection: () => void
  onSelectNode: (id: string | null) => void
  onClearResult: () => void
}) {
  const model = useGraphStore((s) => s.model)
  const addNode = useGraphStore((s) => s.addNode)
  const updateNode = useGraphStore((s) => s.updateNode)
  const removeNode = useGraphStore((s) => s.removeNode)
  const save = useGraphStore((s) => s.save)
  const load = useGraphStore((s) => s.load)
  const reset = useGraphStore((s) => s.reset)

  const selected = useMemo(() => model.nodes.find((n) => n.id === selectedId) ?? null, [model.nodes, selectedId])
  const selectedDefinition = selected ? nodeDefinitionByType[selected.type] : null
  const canRun = model.nodes.length > 0
  const bottleneckNames = result.bottleneckNodeIds
    .map((id) => model.nodes.find((n) => n.id === id)?.name ?? id)
    .join(', ')

  return (
    <div className="control-stack">
      <section className="panel-section">
        <div className="section-heading">
          <span>Build</span>
          <small>Add real system components, then connect them.</small>
        </div>
        <div className="node-palette">
          {nodeCategories.map((category) => (
            <div className="palette-category" key={category}>
              <div className="category-title">{category}</div>
              {nodeCatalog
                .filter((node) => node.category === category)
                .map((t) => (
                  <button
                    key={t.type}
                    type="button"
                    className="palette-button"
                    onClick={() => {
                      const id = addNode(t.type)
                      onSelectNode(id)
                      onClearResult()
                    }}
                  >
                    <span>{t.label}</span>
                    <small>{t.hint}</small>
                  </button>
                ))}
            </div>
          ))}
        </div>
      </section>

      <section className="panel-section">
        <div className="section-heading">
          <span>Simulate</span>
          <small>Watch request data move through the connected path.</small>
        </div>

        <label className="field">
          <span>Traffic</span>
          <div className="range-row">
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={trafficRps}
              onChange={(e) => onTrafficChange(Number(e.target.value))}
            />
            <strong>{trafficRps} RPS</strong>
          </div>
        </label>

        <button type="button" className="primary-button" disabled={!canRun || isRunning} onClick={onRunSimulation}>
          {isRunning ? 'Running simulation' : 'Run simulation'}
        </button>

        <div className="metrics-grid">
          <div>
            <span>Average</span>
            <strong>{metric(result.avgLatencyMs, 'ms')}</strong>
          </div>
          <div>
            <span>P95</span>
            <strong>{metric(result.p95LatencyMs, 'ms')}</strong>
          </div>
          <div>
            <span>Requests</span>
            <strong>{result.processedRequests}</strong>
          </div>
          <div>
            <span>Path</span>
            <strong>{result.pathNodeIds.length || '-'}</strong>
          </div>
        </div>

        <div className="insight-box">
          <span>Bottleneck</span>
          <p>{bottleneckNames || 'Run a simulation to detect busy components.'}</p>
        </div>
      </section>

      <section className="panel-section">
        <div className="section-heading">
          <span>Selected Node</span>
          <small>{selectedDefinition ? `${selectedDefinition.category} component` : 'Configure real project settings.'}</small>
        </div>

        {selected ? (
          <div className="node-editor">
            <label className="field">
              <span>Name</span>
              <input value={selected.name} onChange={(e) => updateNode(selected.id, { name: e.target.value })} />
            </label>
            <div className="config-grid">
              {selectedDefinition?.fields.map((field) => {
                const value = selected.config[field.key]

                if (field.type === 'boolean') {
                  return (
                    <label className="field checkbox-field" key={field.key}>
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => updateNode(selected.id, { config: { [field.key]: e.target.checked } })}
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
                        updateNode(selected.id, { config: { [field.key]: nextValue } })
                      }}
                    />
                  </label>
                )
              })}
            </div>
            {connectFromId === selected.id ? (
              <button type="button" className="secondary-button active" onClick={onCancelConnection}>
                Click a destination node
              </button>
            ) : (
              <button type="button" className="secondary-button" onClick={() => onStartConnection(selected.id)}>
                Start connection
              </button>
            )}
            <button
              type="button"
              className="danger-button"
              onClick={() => {
                removeNode(selected.id)
                onClearResult()
              }}
            >
              Delete node
            </button>
          </div>
        ) : (
          <div className="empty-state">Select a component on the canvas.</div>
        )}
      </section>

      <section className="panel-actions">
        <button type="button" onClick={save}>Save</button>
        <button type="button" onClick={load}>Load</button>
        <button
          type="button"
          onClick={() => {
            reset()
            onClearResult()
          }}
        >
          Reset
        </button>
      </section>
    </div>
  )
}
