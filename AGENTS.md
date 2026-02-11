# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common commands

### Install / dev
- Install dependencies: `npm install`
- Run dev server (Next.js): `npm run dev`
  - App runs at `http://localhost:3000`

### Build / run
- Production build: `npm run build`
- Run production server (after build): `npm start`

### Lint
- Run ESLint: `npm run lint`

### Tests (Vitest)
- Run all tests: `npm run test`
- Run a single test file:
  - `npm run test -- src/lib/evaluateScenario.test.ts`
  - `npm run test -- src/app/api/scenarios/[id]/check/route.test.ts`
- Run tests matching a name pattern:
  - `npm run test -- -t "supports indexed path checks"`
- Watch mode (useful while developing): `npx vitest`

## Environment variables
- `MONGODB_URI` (optional): if set, scenarios are also loaded from MongoDB.
- `MONGODB_DB` (optional): overrides the MongoDB database name.

DB-backed scenarios override seed scenarios when they share the same `id` (see `src/lib/scenarioStore.ts`).

## High-level architecture

### App shape (Next.js App Router)
- `src/app/layout.tsx` sets global styling, JSONEditor CSS, and the theme bootstrapping script.
- `src/app/page.tsx` is the scenario list page (server component) and calls `listScenarios()`.
- `src/app/s/[id]/page.tsx` loads a single scenario via `getScenario(id)` and renders the interactive runner.

### Client-side runner UI
- `src/components/ScenarioRunner.tsx` composes:
  - `ScenarioSidebar` (instructions + progress)
  - `ScenarioEditorPanel` (JSON editor + “Save System Settings”)
  - `SuccessModal`
- `src/components/scenario-runner/useScenarioRunner.ts` owns the client state machine:
  - Reads current JSON from the editor
  - Calls `POST /api/scenarios/:id/check` to evaluate the submission
  - Updates progress + shows success modal on completion

### JSON editor integration
- `src/components/json/JsonEditor.tsx` wraps the `jsoneditor` package.
  - Editor modes: `view`, `tree`, `text`
  - When `readOnlyTextMode` is enabled, switching to `text` makes the underlying textarea read-only.

### Server-side API surface
- `src/app/api/scenarios/route.ts`
  - `GET /api/scenarios` → `{ scenarios: ScenarioSummary[] }`
- `src/app/api/scenarios/[id]/route.ts`
  - `GET /api/scenarios/:id` → `{ scenario }` (404 if missing)
- `src/app/api/scenarios/[id]/check/route.ts`
  - `POST /api/scenarios/:id/check` with body `{ json: JsonValue }` → `{ evaluation }`

### Scenario domain model
- Types: `src/lib/types.ts` (Scenario, checks, evaluation payloads, JsonValue)
- Seed content: `src/lib/seedScenarios.ts`
- Validation:
  - `src/lib/scenarioSchemas.ts` (Zod schemas for JSON + scenarios)
  - Used to validate MongoDB documents before treating them as scenarios
- Storage/lookup:
  - `src/lib/scenarioStore.ts` loads seed scenarios and (optionally) merges in MongoDB scenarios.
  - MongoDB connection: `src/lib/db.ts` (mongoose connection cached on `globalThis`).
  - MongoDB model: `src/lib/models/ScenarioModel.ts`.
- Evaluation engine:
  - `src/lib/evaluateScenario.ts` evaluates scenario checks against a submitted JSON document.
  - Path syntax supports dot paths and array indices (e.g. `settings.roles[0]`).

### Module resolution
- The `@/*` import alias maps to `src/*` (see `tsconfig.json` and `vitest.config.ts`).
