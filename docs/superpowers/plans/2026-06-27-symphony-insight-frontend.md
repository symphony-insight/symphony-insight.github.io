# SymPhony Insight Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished front-end-only SymPhony Insight MVP that demonstrates one child's 8-session observation journey, motion-affect trends, and teacher-reviewed AI report workflow.

**Architecture:** A Vite React TypeScript app will render four routed workbench pages backed by a mock API layer. Pages consume typed contracts instead of importing raw mock data directly, so the mock API can later be replaced by FastAPI endpoints without rewriting UI components.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Recharts, Zustand, Vitest, Testing Library, Lucide React.

## Global Constraints

- First phase is frontend only: no real backend, database, sensors, or LLM API.
- Use mock data for one child, Xiaoyu, across 8 sessions.
- UI copy must not claim diagnosis, treatment effect, disease improvement, or comparison with typical children.
- Use "observation", "trend", "professional review", "participation", "motion expression", and "affect signal" language.
- All externally visible report actions must pass through teacher review; no automatic publishing.
- Pages should feel like a warm professional teacher workbench, not a medical dashboard or a child game.
- Current directory is not a git repository; skip commit steps and report this in final.

---

### Task 1: Project Scaffold And Test Harness

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/test/smoke.test.ts`

**Interfaces:**
- Produces: runnable scripts `npm run dev`, `npm run build`, `npm test`

- [ ] **Step 1: Write the failing smoke test**

```ts
import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("runs TypeScript tests", () => {
    expect("SymPhony Insight").toContain("Insight");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/smoke.test.ts`
Expected: FAIL because package scripts and dependencies are not installed yet.

- [ ] **Step 3: Create the Vite React project configuration**

Create the files listed above with React, Vitest, Tailwind, and jsdom configured.

- [ ] **Step 4: Install dependencies and verify**

Run: `npm install`
Run: `npm test -- --run src/test/smoke.test.ts`
Expected: PASS.

### Task 2: Domain Types, Mock Data, And Mock API

**Files:**
- Create: `src/types/domain.ts`
- Create: `src/data/mockData.ts`
- Create: `src/api/mockApi.ts`
- Create: `src/api/mockApi.test.ts`

**Interfaces:**
- Produces: `mockApi.getChild`, `getSessions`, `getInsights`, `getReportDraft`, `updateReportStatus`, `getAuditLogs`
- Produces: types `Child`, `SessionSummary`, `LongitudinalInsight`, `ReportDraft`, `ReportStatus`, `AuditLog`

- [ ] **Step 1: Write failing API tests**

Test that the mock API returns 8 sessions for Xiaoyu, forbids medical claim language in insights/report text, and records an audit log when approving a report.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- --run src/api/mockApi.test.ts`
Expected: FAIL because files do not exist.

- [ ] **Step 3: Implement types, mock data, and mock API**

Define typed data for Xiaoyu, 8 sessions, 5 insights, report drafts, and audit logs.

- [ ] **Step 4: Run API tests**

Run: `npm test -- --run src/api/mockApi.test.ts`
Expected: PASS.

### Task 3: App Shell, Routing, And Shared UI

**Files:**
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/routes.tsx`
- Create: `src/app/App.test.tsx`
- Create: `src/styles.css`
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/StatusPill.tsx`

**Interfaces:**
- Consumes: mock API functions from Task 2
- Produces: routable shell with nav links for overview, sessions, motion-affect, and report pages

- [ ] **Step 1: Write failing app shell tests**

Test that the shell renders the product name, route navigation, STOP button, and compliance banner.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- --run src/app/App.test.tsx`
Expected: FAIL because app files do not exist.

- [ ] **Step 3: Implement app shell and shared UI**

Build a left sidebar, top child context bar, safety banner, and routed content outlet.

- [ ] **Step 4: Run app shell tests**

Run: `npm test -- --run src/app/App.test.tsx`
Expected: PASS.

### Task 4: Overview And Session Timeline Pages

**Files:**
- Create: `src/pages/OverviewPage.tsx`
- Create: `src/pages/SessionTimelinePage.tsx`
- Create: `src/pages/pages.test.tsx`
- Create: `src/components/charts/MotionTrendChart.tsx`
- Create: `src/components/session/SessionTimeline.tsx`
- Create: `src/components/insight/InsightCard.tsx`

**Interfaces:**
- Consumes: `mockApi.getChild`, `getSessions`, `getInsights`
- Produces: overview dashboard and 8-session timeline

- [ ] **Step 1: Write failing page tests**

Test that overview shows Xiaoyu, 8 sessions, review language, and no forbidden medical phrases. Test that the session page includes Session 6 high-brightness withdrawal and Session 8 completed co-creation flow.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- --run src/pages/pages.test.tsx`
Expected: FAIL because pages do not exist.

- [ ] **Step 3: Implement overview and timeline**

Render metric cards, trend chart, insight cards, and detailed timeline items.

- [ ] **Step 4: Run page tests**

Run: `npm test -- --run src/pages/pages.test.tsx`
Expected: PASS.

### Task 5: Motion-Affect And Report Review Pages

**Files:**
- Create: `src/pages/MotionAffectPage.tsx`
- Create: `src/pages/ReportReviewPage.tsx`
- Create: `src/components/charts/MotionAffectMatrix.tsx`
- Create: `src/components/charts/RecoveryPatternChart.tsx`
- Create: `src/components/report/ReportDraftPanel.tsx`
- Create: `src/components/report/TeacherReviewPanel.tsx`
- Modify: `src/pages/pages.test.tsx`

**Interfaces:**
- Consumes: `mockApi.getInsights`, `getReportDraft`, `updateReportStatus`, `getAuditLogs`
- Produces: visual motion-affect analysis and working report review state transition

- [ ] **Step 1: Add failing tests**

Test that the motion-affect page shows observation-only claims and that the report page can approve the draft and reveal an audit entry.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- --run src/pages/pages.test.tsx`
Expected: FAIL on missing page behavior.

- [ ] **Step 3: Implement motion-affect and report pages**

Render matrix, precursor chart, recovery chart, professional draft, parent summary, teacher notes, and review actions.

- [ ] **Step 4: Run page tests**

Run: `npm test -- --run src/pages/pages.test.tsx`
Expected: PASS.

### Task 6: Build Verification And Local Server

**Files:**
- Modify: none unless verification reveals defects.

**Interfaces:**
- Consumes: all previous tasks.
- Produces: verified local dev server URL.

- [ ] **Step 1: Run full tests**

Run: `npm test -- --run`
Expected: PASS.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Start dev server**

Run: `npm run dev -- --host 127.0.0.1`
Expected: Vite serves the app and prints a local URL.

## Self-Review

- Spec coverage: The plan covers frontend-only scope, mock data, 4 P0 pages, observation-safe copy, report review gate, and future backend API seam.
- Placeholder scan: No TBD/TODO/fill-later instructions remain.
- Type consistency: `Child`, `SessionSummary`, `LongitudinalInsight`, `ReportDraft`, `ReportStatus`, and `AuditLog` are consistently referenced across tasks.
