import { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { SimulationPanel } from './components/SimulationPanel'
import { BuilderCanvas } from './components/BuilderCanvas'

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <ReactFlowProvider>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 360px', gap: 12, padding: 12 }}>
        <SimulationPanel
          selectedId={selectedId}
          onSelectNode={(id) => setSelectedId(id)}
        />
        <BuilderCanvas selectedId={selectedId} onSelectNode={(id) => setSelectedId(id)} />
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 12, textAlign: 'left' }}>
          <h2 style={{ marginTop: 0 }}>Mentor (Phase 2)</h2>
          <p style={{ marginBottom: 12 }}>
            Run a basic latency simulation based on your graph. We will measure average latency and approximate bottlenecks.
          </p>
          <p style={{ marginBottom: 12 }}>
            Next upgrades: traffic-driven retries/failures, queue buildup, and bottleneck detection based on saturation.
          </p>

          <div style={{ fontSize: 13, color: 'var(--text)' }}>
            {selectedId ? (
              <div>
                Selected node: <code>{selectedId}</code>
              </div>
            ) : (
              <div>Select a node to edit configuration.</div>
            )}
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  )
}
