# System Design Simulator Frontend

Interactive React app for sketching a system architecture and running a basic latency simulation over the graph.

## What You Can Do

- Add categorized real-world system components: clients, DNS, CDN, load balancers, API gateways, services, databases, caches, queues, streams, object storage, third-party APIs, payments, notifications, and monitoring.
- Connect components by dragging handles or by using the simple click-to-connect flow.
- Configure per-node settings based on the component type, such as latency, capacity, replicas, cache hit rate, queue retention, storage size, provider, timeout, and alerting.
- Run a simple traffic simulation and watch request data animate through the connected architecture.
- View average latency, p95 latency, processed requests, route length, and likely bottlenecks.
- Save, load, and reset the current graph using browser local storage.

## Requirements

- Node.js 24 or newer is recommended for the current dependency set.
- npm, included with Node.js.

## Install

From this folder:

```bash
npm install
```

On Windows PowerShell, if `npm` is blocked by the execution policy, use:

```powershell
npm.cmd install
```

## Run In Development

```bash
npm run dev
```

PowerShell fallback:

```powershell
npm.cmd run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Use The App

1. Click component buttons in the left panel to add nodes.
2. Select a source node on the canvas.
3. Click `Start connection` in the left panel.
4. Click the destination node on the canvas to create a directed link.
5. Select any node and edit its name or latency in milliseconds.
6. Adjust the traffic slider.
7. Click `Run simulation` to calculate metrics and animate data flow through the architecture.
8. Click `Save` to persist the graph in browser local storage, `Load` to restore it, or `Reset` to clear it.

## Build For Production

```bash
npm run build
```

PowerShell fallback:

```powershell
npm.cmd run build
```

The production output is written to `dist/`.

## Preview A Production Build

```bash
npm run preview
```

PowerShell fallback:

```powershell
npm.cmd run preview
```

## Quality Checks

```bash
npm run lint
npm run build
```

The build script uses `vite build --app` because the installed Vite 8 toolchain expects the app builder path for this project.
