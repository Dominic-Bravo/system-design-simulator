import { useEffect, useMemo, useState } from 'react'
import { useGraphStore } from '../stores/graphStore'
import type { NodeType } from '../simulation/types'
import { runBasicSimulation } from '../simulation/engine'

const nodeTypes: { type: NodeType; label: string }[] = [
  { type: 'load_balancer', label: 'Load Balancer' },
  { type: 'api', label: 'API' },
  { type: 'cache', label: 'Cache (Redis)' },
  { type: 'queue', label: 'Queue' },
  { type: 'database', label: 'Database' },
]

type Bench = ReturnType<typeof runBasicSimulation>

const EMPTY_BENCH: Bench = {
  avgLatencyMs: 0,
  p95LatencyMs: 0,
  processedRequests: 0,
  bottleneckNodeIds: [],
}

function formatBench(bench: Bench) {
  if (bench.processedRequests <= 0) return 'Run simulation to see metrics.'
  const top = bench.bottleneckNodeIds.length ? bench.bottleneckNodeIds.join(', ') : 'None'
  return `avg: ${bench.avgLatencyMs.toFixed(1)}ms | p95: ${bench.p95LatencyMs.toFixed(1)}ms | bottleneck: ${top}`
}

export function SimulationPanel({
  selectedId,
  onSelectNode,
}: {
  selectedId: string | null
  onSelectNode: (id: string) => void
}) {
  const model = useGraphStore((s) => s.model)
  const addNode = useGraphStore((s) => s.addNode)
  const updateNode = useGraphStore((s) => s.updateNode)
  const save = useGraphStore((s) => s.save)
  const load = useGraphStore((s) => s.load)
  const reset = useGraphStore((s) => s.reset)

  const selected = useMemo(() => model.nodes.find((n) => n.id === selectedId) ?? null, [model.nodes, selectedId])

  const [trafficRps, setTrafficRps] = useState(100)
  const [bench, setBench] = useState<Bench>(EMPTY_BENCH)

  useEffect(() => {
    // Keep bench until user runs simulation.
  }, [trafficRps])

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 12, textAlign: 'left' }}>
      <h2 style={{ marginTop: 0 }}>Architecture Builder</h2>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Add node</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
          {nodeTypes.map((t) => (
            <button
              key={t.type}
              type="button"
              onClick={() => {
                const id = addNode(t.type)
                onSelectNode(id)
              }}
              style={{
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Traffic & Simulation (Phase 2)</div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="range"
            min={10}
            max={1000}
            step={10}
            value={trafficRps}
            onChange={(e) => setTrafficRps(Number(e.target.value))}
          />
          <span style={{ minWidth: 90, textAlign: 'right', fontFamily: 'var(--mono)' }}>{trafficRps} RPS</span>
        </label>

        <button
          type="button"
          onClick={() => {
            const result = runBasicSimulation(model, trafficRps)
            setBench(result)
          }}
          style={{
            marginTop: 10,
            width: '100%',
            padding: 10,
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'transparent',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Run simulation
        </button>

        <div style={{ marginTop: 10, padding: 10, borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 6 }}>Metrics</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{formatBench(bench)}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => save()}
          style={{ padding: 10, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => load()}
          style={{ padding: 10, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
        >
          Load
        </button>
        <button
          type="button"
          onClick={() => {
            reset()
            setBench(EMPTY_BENCH)
          }}
          style={{
            gridColumn: 'span 2',
            padding: 10,
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>Node config</h3>
        {!selected ? (
          <div style={{ fontSize: 13, opacity: 0.9 }}>Select a node to edit.</div>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 13, opacity: 0.9 }}>Name</span>
              <input
                value={selected.name}
                onChange={(e) => updateNode(selected.id, { name: e.target.value })}
                style={{ padding: 8, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent' }}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 13, opacity: 0.9 }}>Latency (ms)</span>
              <input
                type="number"
                value={typeof selected.config?.latencyMs === 'number' ? selected.config.latencyMs : 0}
                onChange={(e) => {
                  const latencyMs = Number(e.target.value)
                  updateNode(selected.id, { config: { latencyMs } })
                }}
                style={{ padding: 8, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent' }}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

