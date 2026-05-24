# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**Trips & Roads V2** is an offline-first Electron desktop app for road trip planning, budgeting, and documentation. Users can plan multi-day itineraries, track multi-currency expenses, embed route maps, and export a PDF logbook — all without requiring an internet connection at runtime.

## Architecture

Two-process Electron architecture:

- **Main process** (`main/`, Node.js CommonJS) — owns SQLite via `better-sqlite3`, handles OS interactions (file system, PDF export), and exposes functionality to the renderer via IPC handlers.
- **Renderer process** (`src/`, React 19 + TypeScript + Vite) — the full UI. Communicates with the main process exclusively through the IPC bridge.

### IPC bridge pattern

All DB access and OS calls from the UI must go through IPC. The secure layout is:
- `main/preload.js` — uses `contextBridge` to expose a typed API to the renderer.
- `main/main.js` — registers `ipcMain.handle(channel, handler)` listeners.
- `src/` — calls `window.api.<method>()` (never imports anything from `main/` directly).
- `BrowserWindow` must be created with `contextIsolation: true` and `nodeIntegration: false`.

### Database schema (SQLite, `database.db` at project root)

`PRAGMA foreign_keys = ON`. All child tables cascade-delete from their parent.

| Table | Key columns | Notes |
|---|---|---|
| `road_trips` | `id` (UUID), `title`, `main_currency`, `created_at` | Top-level entity |
| `steps` | `id`, `road_trip_id`, `title`, `day_number`, `order_index`, `description`, `latitude`, `longitude` | `description` stored as raw Markdown |
| `transports` | `id`, `step_id`, `type` (`VOITURE`/`FERRY`/`TRAIN`/`BUS`/`VELO`/`MARCHE`), `route_geometry` | `route_geometry` is a JSON string of coordinate arrays, fetched online and cached for offline rendering |
| `expenses` | `id`, `road_trip_id`, `step_id` (optional), `title`, `category` (`TRANSPORT`/`LOGEMENT`/`NOURRITURE`/`ACTIVITE`/`AUTRE`), `amount`, `currency` | Currency conversion to `main_currency` happens in the UI |
| `attachments` | `id`, `step_id`, `file_type` (`PDF`/`IMAGE`), `file_path` | Absolute local path; Electron copies the file to a local directory on import |

All `id` fields are UUIDs generated in JS before insertion.

### Core features (planned / in progress)

1. **Rich Markdown editor** — WYSIWYG on step `description`. Local images are copied by Electron and their absolute path is embedded in the Markdown string.
2. **Leaflet map routing** — fetches route geometry online, saves it to `transports.route_geometry`, renders offline.
3. **Multi-currency budgeting** — category breakdown with currency conversion to `main_currency`, displayed as charts.
4. **PDF export** — uses Electron's `webContents.printToPDF()` on a hidden, print-optimized React view (`@media print`).

## Development workflow

Two processes must run simultaneously in dev:

```powershell
# Terminal 1 — Vite dev server (renderer, http://localhost:5173)
cd src
npm run dev

# Terminal 2 — Electron (main process)
npm start
```

### Frontend commands (from `src/`)

```powershell
npm run dev      # Vite HMR dev server
npm run build    # tsc -b && vite build
npm run lint     # eslint
npm run preview  # preview production build
```

### Root-level commands

```powershell
npm start        # electron .
```

## Native module constraint (important)

`better-sqlite3` is a native module that must be compiled against Electron's exact Node ABI — **not** the system Node.js. The project uses **Electron 41.x (NMV 145)** because that is the latest version for which prebuilt binaries exist in `better-sqlite3 v12.10.0`.

- **Do not upgrade Electron beyond 41.x** until `better-sqlite3` publishes a prebuilt for the newer NMV.
- The prebuilt binary (`electron-v145-win32-x64`) is downloaded via `prebuild-install`. It lives at `node_modules/better-sqlite3/build/Release/better_sqlite3.node`. **This binary cannot be loaded by the system Node.js** (NMV 137) — that is expected and not a bug.
- If `better-sqlite3` breaks after `npm install`, re-run from the project root: `npx prebuild-install --runtime electron --target 41.7.0 --arch x64` from inside `node_modules/better-sqlite3`.
- Building from source (`electron-rebuild`) requires Python 3 + Visual Studio C++ Build Tools, which may not be present.

## Coding standards

- `main/` — pure `.js` (CommonJS, `require`/`module.exports`). No TypeScript compilation needed here.
- `src/` — strictly typed `.tsx`/`.ts` (ES modules). Never import anything from `main/` in the renderer.
- `main/database.js` is main-process only; it must never be bundled into the renderer.
- `src/` package uses `"type": "module"`; root package uses `"type": "commonjs"` — don't mix syntax across the boundary.
