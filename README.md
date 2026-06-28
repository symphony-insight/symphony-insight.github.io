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
npm run dev:frontend
```

Open `http://127.0.0.1:5173/`.

## Local LLM System

Copy the backend environment template and fill in your DeepSeek key:

```bash
cp backend/.env.example backend/.env.local
```

Set at least:

```env
SYMPHONY_AI_PROVIDER_MODE=real
SYMPHONY_LLM_PROVIDER=deepseek
SYMPHONY_LLM_ENDPOINT=https://api.deepseek.com/chat/completions
SYMPHONY_LLM_API_KEY=...
SYMPHONY_LLM_MODEL=deepseek-v4-flash
```

Start the backend:

```bash
npm run dev:backend
```

In a second terminal, start the frontend in backend mode:

```bash
npm run dev:frontend:backend
```

Open `http://127.0.0.1:5173/#/child/xiaoyu/report` and click `重新整理草稿`.
The frontend calls the local backend, and the backend calls DeepSeek. API keys
stay in `backend/.env.local`; the browser never receives them.

## Verification

```bash
npm test
npm run build
npm run test:backend
```

## GitHub Pages

This repo includes a GitHub Actions workflow that builds the Vite app and deploys `dist/` to GitHub Pages.

For an organization or user Pages repository such as `symphony-insight.github.io`, keep Vite's `base` as `/`.

For LLM-backed GitHub Pages, do not put the DeepSeek key in the frontend build.
Deploy the backend separately, then set the repository Actions secret
`SYMPHONY_API_BASE_URL` to that backend's public `/api/v1` URL. See
`docs/github-pages-llm-deployment.md`.

For production, deploy the same-origin server version at `symphony.yjx.me`; see
`docs/server-deployment.md`.
