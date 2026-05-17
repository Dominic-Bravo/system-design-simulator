import { useEffect, useMemo, useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { SimulationPanel } from './components/SimulationPanel'
import { BuilderCanvas } from './components/BuilderCanvas'
import { useGraphStore } from './stores/graphStore'
import { runBasicSimulation } from './simulation/engine'
import type { SimulationResult } from './simulation/engine'

const EMPTY_RESULT: SimulationResult = {
  avgLatencyMs: 0,
  p95LatencyMs: 0,
  processedRequests: 0,
  bottleneckNodeIds: [],
  pathNodeIds: [],
  pathEdgeIds: [],
}

export default function App() {
  const model = useGraphStore((s) => s.model)
  const addEdge = useGraphStore((s) => s.addEdge)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [connectFromId, setConnectFromId] = useState<string | null>(null)
  const [trafficRps, setTrafficRps] = useState(100)
  const [result, setResult] = useState<SimulationResult>(EMPTY_RESULT)
  const [activeStep, setActiveStep] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)

  const activeNodeId = activeStep >= 0 ? result.pathNodeIds[activeStep] : undefined
  const activeEdgeId = activeStep >= 0 ? result.pathEdgeIds[activeStep] : undefined

  const status = useMemo(() => {
    if (model.nodes.length === 0) return 'Add nodes to start building.'
    if (connectFromId) return 'Connection mode: click the destination component on the canvas.'
    if (model.edges.length === 0) return 'Connect nodes to create a request path.'
    if (isRunning) return 'Simulation running: request packets are moving through the design.'
    if (result.processedRequests > 0) return 'Simulation complete. Tune latency or traffic and run again.'
    return 'Ready to simulate.'
  }, [connectFromId, isRunning, model.edges.length, model.nodes.length, result.processedRequests])

  useEffect(() => {
    if (!isRunning) return

    const timer = window.setInterval(() => {
      setActiveStep((current) => {
        const next = current + 1
        if (next >= result.pathNodeIds.length) {
          window.clearInterval(timer)
          window.setTimeout(() => {
            setIsRunning(false)
            setActiveStep(-1)
          }, 450)
          return current
        }
        return next
      })
    }, 850)

    return () => window.clearInterval(timer)
  }, [isRunning, result.pathNodeIds.length])

  const runSimulation = () => {
    const nextResult = runBasicSimulation(model, trafficRps)
    setResult(nextResult)
    setIsRunning(nextResult.pathNodeIds.length > 0)
    setActiveStep(nextResult.pathNodeIds.length > 0 ? 0 : -1)
  }

  const selectNode = (id: string | null) => {
    if (id && connectFromId && connectFromId !== id) {
      addEdge(connectFromId, id)
      setConnectFromId(null)
      setSelectedId(id)
      setResult(EMPTY_RESULT)
      setActiveStep(-1)
      setIsRunning(false)
      return
    }

    setSelectedId(id)
  }

  return (
    <ReactFlowProvider>
      <main className="app-shell">
        <aside className="panel panel-left">
          <SimulationPanel
            selectedId={selectedId}
            trafficRps={trafficRps}
            result={result}
            isRunning={isRunning}
            onTrafficChange={setTrafficRps}
            onRunSimulation={runSimulation}
            connectFromId={connectFromId}
            onStartConnection={(id) => setConnectFromId(id)}
            onCancelConnection={() => setConnectFromId(null)}
            onSelectNode={selectNode}
            onClearResult={() => {
              setResult(EMPTY_RESULT)
              setActiveStep(-1)
              setIsRunning(false)
              setConnectFromId(null)
            }}
          />
        </aside>

        <section className="workspace">
          <header className="topbar">
            <div>
              <h1>System Design Simulator</h1>
              <p>{status}</p>
            </div>
            <div className="topbar-stats" aria-label="Architecture summary">
              <span>{model.nodes.length} nodes</span>
              <span>{model.edges.length} links</span>
              <span>{trafficRps} RPS</span>
            </div>
          </header>

          <BuilderCanvas
            selectedId={selectedId}
            activeNodeId={activeNodeId}
            activeEdgeId={activeEdgeId}
            connectFromId={connectFromId}
            pathNodeIds={result.pathNodeIds}
            onSelectNode={selectNode}
          />
        </section>
      </main>
    </ReactFlowProvider>
  )
}
