# Backend LLM Service

This backend folder contains the local report-generation service and DeepSeek
adapter. It is intentionally separate from the Vite frontend so API keys never
reach the browser or GitHub Pages.

## DeepSeek Setup

1. Copy the template:

```bash
cp backend/.env.example backend/.env.local
```

2. Fill these values in `backend/.env.local`:

```env
SYMPHONY_AI_PROVIDER_MODE=real
SYMPHONY_LLM_PROVIDER=deepseek
SYMPHONY_LLM_ENDPOINT=https://api.deepseek.com/chat/completions
SYMPHONY_LLM_API_KEY=...
SYMPHONY_LLM_MODEL=deepseek-v4-flash
```

`deepseek-v4-pro` is also supported. `deepseek-chat` and `deepseek-reasoner`
remain accepted as temporary aliases, but DeepSeek marks them for deprecation
after 2026-07-24. The adapter uses DeepSeek's official chat-completions shape
with Bearer authentication and JSON mode.

3. Run the local smoke test:

```bash
cd backend
python3 scripts/deepseek_smoke.py
```

4. Run backend unit tests:

```bash
cd backend
python3 -m unittest discover -s tests
```

## Local API Server

Start the backend:

```bash
npm run dev:backend
```

The server listens at:

```text
http://127.0.0.1:8000/api/v1
```

Available routes:

```text
GET    /api/v1/health
GET    /api/v1/children/:childId/reports/current
GET    /api/v1/children/:childId/audit-logs
POST   /api/v1/children/:childId/reports/draft
PATCH  /api/v1/reports/:reportId/status
```

Start the frontend against this backend:

```bash
npm run dev:frontend:backend
```

Open:

```text
http://127.0.0.1:5173/#/child/xiaoyu/report
```

Click `重新整理草稿` to generate a new report draft through the backend. When
`SYMPHONY_AI_PROVIDER_MODE=real`, the backend calls DeepSeek. When the mode is
`mock`, it returns a deterministic local draft for development.
