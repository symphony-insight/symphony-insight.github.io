# SymPhony Insight

SymPhony Insight is a frontend prototype for teacher-centered, longitudinal observation of child music co-creation sessions.

The app is intentionally observation-only. It organizes activity records, evidence-backed rubrics, teacher review, and parent-facing summaries without making medical claims or automated diagnoses.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Recharts
- Vitest

## Local Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Verification

```bash
npm test -- --run
npm run build
```

## GitHub Pages

This repo includes a GitHub Actions workflow that builds the Vite app and deploys `dist/` to GitHub Pages.

For an organization or user Pages repository such as `symphony-insight.github.io`, keep Vite's `base` as `/`.
