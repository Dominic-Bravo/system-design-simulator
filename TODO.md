remove this
I'll update this tomorrow 
add linking of nodes and make sure that the data in simulation follows the flow of the system design. 

# SystemDesignSimulator - TODO

add in the future a linking  to nodes like on how the nodes communicate 
also add rules and boundary
and also cost

## Phase 1 MVP (Foundation)
- [x] Inspect current frontend structure (App.tsx/main.tsx) and replace scaffold UI with simulator layout
- [x] Add Zustand store for nodes/edges graph model + simulation settings
- [x] Implement React Flow canvas with custom node types (API/Database/Cache/Queue/Load Balancer)
- [x] Implement edge creation + basic request-flow animation/traversal (Phase 1 traversal is implicit; Phase 2 does metrics)
- [x] Implement node configuration panel (rename + basic per-node latency)
- [x] Implement save/load of architecture to/from localStorage
- [x] Wire “Run Simulation” + “Traffic” controls
- [x] Basic learning/mentor panel (Phase 1/2 text)
- [x] Verify build

## Phase 2 — Basic Simulation (latency + bottleneck)
- [x] Implement simulation engine (`runBasicSimulation`) for latency metrics
- [x] Hook Phase 2 simulation into UI and display avg/p95 + bottleneck nodes

## Phase 3 — Learning features
- [ ] Guided tutorials
- [ ] Architecture scoring
- [ ] System challenges
- [ ] Recommendations/learning explanations

## Phase 4 — Advanced simulation
- [ ] Failure simulation
- [ ] Retry behavior
- [ ] Queue buildup + bottleneck detection by saturation
- [ ] Replication + autoscaling

## Phase 5 — Collaboration
- [ ] Multi-user collaboration + shared projects
- [ ] Version history + branching
- [ ] Comments/architecture reviews

