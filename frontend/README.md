# System Design Simulator Frontend

Interactive React app for sketching a system architecture and running a basic latency simulation over the graph.

## What You Can Do

- Add system components: load balancer, API, cache, queue, and database.
- Connect components on the canvas to create request paths.
- Configure per-node latency.
- Run a simple traffic simulation and view average latency, p95 latency, processed requests, and likely bottlenecks.
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

1. Click a component button in the left panel to add a node.
2. Drag from the right handle of one node to the left handle of another node to connect them.
3. Select a node and edit its name or latency in milliseconds.
4. Adjust the traffic slider.
5. Click `Run simulation` to calculate latency metrics.
6. Click `Save` to persist the graph in browser local storage, `Load` to restore it, or `Reset` to clear it.

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
