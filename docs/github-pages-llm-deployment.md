# GitHub Pages + LLM Deployment

GitHub Pages is static hosting. It can host the React frontend, but it cannot
securely hold or use a DeepSeek API key at runtime.

## Safe Architecture

```text
Browser on GitHub Pages
  -> public backend URL
  -> backend secret environment variable
  -> DeepSeek API
```

The browser must never receive `SYMPHONY_LLM_API_KEY`.

## GitHub Pages Secret

In the GitHub repository settings, add this Actions secret:

```text
SYMPHONY_API_BASE_URL=https://your-backend.example.com/api/v1
```

This value is not the DeepSeek key. It is only the public backend base URL.
When this secret exists, the Pages workflow builds the frontend with:

```text
VITE_API_MODE=backend
VITE_API_BASE_URL=$SYMPHONY_API_BASE_URL
```

If the secret is missing, the Pages deployment stays in mock mode so the public
demo still works without a backend.

## Backend Secret

Deploy the backend separately on a platform that can run Python and store
runtime secrets, then set:

```env
SYMPHONY_AI_PROVIDER_MODE=real
SYMPHONY_LLM_PROVIDER=deepseek
SYMPHONY_LLM_ENDPOINT=https://api.deepseek.com/chat/completions
SYMPHONY_LLM_API_KEY=...
SYMPHONY_LLM_MODEL=deepseek-v4-flash
SYMPHONY_CORS_ORIGINS=https://symphony-insight.github.io,http://localhost:5173,http://127.0.0.1:5173
```

The backend must expose:

```text
GET    /api/v1/health
GET    /api/v1/children/:childId/reports/current
GET    /api/v1/children/:childId/audit-logs
POST   /api/v1/children/:childId/reports/draft
PATCH  /api/v1/reports/:reportId/status
```

## Do Not Do This

Do not create any secret named like this and pass it into Vite:

```text
VITE_DEEPSEEK_API_KEY
VITE_LLM_API_KEY
DEEPSEEK_API_KEY
SYMPHONY_LLM_API_KEY
```

Any value used by Vite during a static Pages build can become visible in the
downloaded JavaScript bundle.

## Deployment Check

After pushing to `main`, GitHub Actions runs:

```bash
npm run test:all
npm run build
```

Then it publishes `dist/` to the `gh-pages` branch.
