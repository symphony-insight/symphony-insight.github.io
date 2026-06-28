# Backend LLM Smoke Test

This backend folder currently contains the local DeepSeek smoke-test adapter.
It is intentionally separate from the Vite frontend so API keys never reach the
browser or GitHub Pages.

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
