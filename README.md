# SymPhony Insight

SymPhony Insight is a frontend prototype for long-term, evidence-backed observation of children's AI music co-creation sessions.

The current prototype focuses on:

- teacher-centered review rather than automatic diagnosis;
- multi-child switching and Chinese/English UI;
- nine plain-language observation rubrics backed by established assessment frameworks;
- traceable report drafts that require teacher review before export.

## Local Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test -- --run
npm run build
```

## GitHub Pages

This repository is intended to publish the organization site at:

```text
https://symphony-insight.github.io/
```

The `.github/workflows/deploy.yml` workflow builds the Vite app and deploys `dist/` through GitHub Pages.
