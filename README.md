System Settings Trainer — a small internal training app that simulates the “system settings” JSON editor (Tree/Text views + Save button) so teammates can practice editing settings safely.

## Getting Started

Install deps and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scenarios

- Seed scenarios live in `src/lib/seedScenarios.ts`.
- Scenarios are validated by simple “checks” (path + operator + expected) in `src/lib/evaluateScenario.ts`.

## Optional MongoDB (for future trainer-created scenarios)

If `MONGODB_URI` is set, the app will also load scenarios from MongoDB (DB scenarios override seed scenarios with the same `id`).

Env vars:

- `MONGODB_URI`
- `MONGODB_DB` (optional)

## Deploy on Vercel

- Import this repo into Vercel.
- (Optional) Add `MONGODB_URI` in Project → Settings → Environment Variables.
- Deploy.

This app is currently authless/anonymous (demo-friendly). Add Vercel access controls if you want it internal-only.
