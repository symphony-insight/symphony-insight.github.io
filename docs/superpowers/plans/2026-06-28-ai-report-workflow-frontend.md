# AI Report Workflow Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在当前 SymPhony Insight 前端上实现“系统整理草稿 → 表述检查 → 老师复核 → 家长摘要导出”的报告工作流，并新增“报告怎么来的”说明页。

**Architecture:** 继续使用现有 React/Vite/Tailwind/Zustand/mock API 架构，不重建页面框架。先扩展 `ReportDraft` 数据契约与 `mockApi.generateReportDraft()`，再把报告页拆成小组件组合，最后新增 `ReportMethodPage` 和路由/导航入口。评分依据继续由现有“评分说明”页承担，报告页只提供跳转和引用，不复制阈值表、DOI 文献或文献卡片。

**Tech Stack:** React 19, TypeScript 5.9, Vite 6, Tailwind CSS, Zustand, Vitest, Testing Library, lucide-react.

## Global Constraints

- 本轮只做前端，不接真实后端，不接真实 LLM API。
- 保持当前 premium dashboard 的视觉系统、路由结构、状态管理和 mock API。
- 不重做首页、评分说明页或整体视觉系统。
- 不引入重型动画库或新设计系统。
- 不新增单独工程控制台。
- 不上传原始音视频。
- 不输出诊断、治疗建议、疗效判断、病情好转、康复有效、恢复正常。
- 中文主流程不得出现 `LLM`、`API`、`provider`、`prompt`、`payload`、`model id`。
- `AI 网关`、`mock 服务`、`真实模型服务`、`生成版本`、`后端密钥` 只允许出现在“报告怎么来的”页的折叠技术说明中。
- `9 项观察问题` 的阈值表、当前档位、定量依据和支撑文献，以现有“评分说明”页为准。
- 报告页必须提供进入 `#/child/:childId/rubrics` 的 `查看评分说明` 入口。
- 动效只使用 CSS transition、opacity、transform、box-shadow、已有 `page-enter` 和轻微 loading 状态。
- 所有新增主要文案需要支持中英文。
- 计划中的中文代码片段是 `zh` 文案示例；实现时必须使用 `language` 参数、`t()`，或组件内明确的双语 copy map 提供中英文分支，不能把新增主流程文案写成中文-only。

---

## File Structure

- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/types/domain.ts`
  - Add report generation and safety display types.
  - Extend `ReportDraft` with generation metadata, safety display fields, and evidence trace.

- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/data/mockData.ts`
  - Add generation metadata and evidence trace to every mock report.
  - Keep existing report copy observation-only.

- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/api/mockApi.ts`
  - Add `generateReportDraft(childId: string): Promise<ReportDraft>`.
  - Add system audit log when draft is regenerated.

- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/api/mockApi.test.ts`
  - Cover generation contract, status update, audit log, unknown child error.

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/ReportWorkflowSteps.tsx`
  - Render four-step report workflow.

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/ReportSourceSummary.tsx`
  - Render source cards and link to scoring guide.

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/ReportSafetyNotice.tsx`
  - Render expression-check status and flagged phrases for teachers.

- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/ReportDraftPanel.tsx`
  - Add draft labels, parent-export hint, and blocked summary state.

- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/TeacherReviewPanel.tsx`
  - Add safety notice, regenerate button, and generating state.

- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/pages/ReportReviewPage.tsx`
  - Compose workflow/source/review/draft components.
  - Handle regenerate action and loading state.

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/ReportMethodFlow.tsx`
  - Shared visual flow for the explanation page.

- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/pages/ReportMethodPage.tsx`
  - Explain how reports are created, what AI does, what it does not do, and link to scoring guide.

- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/app/routes.tsx`
  - Route `#/child/:childId/report-method` to `ReportMethodPage`.

- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/layout/Sidebar.tsx`
  - Add `报告怎么来的` navigation item.

- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/i18n.ts`
  - Add report workflow and report-method labels.

- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/pages/pages.test.tsx`
  - Cover report workflow page and report method page.

- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/test/smoke.test.ts`
  - Add route-level smoke checks.

---

### Task 1: Extend Report Domain And Mock Generation API

**Files:**
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/types/domain.ts`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/data/mockData.ts`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/api/mockApi.ts`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/api/mockApi.test.ts`

**Interfaces:**
- Consumes existing:
  - `ReportDraft`
  - `ReportStatus`
  - `EvaluationDimension["id"]`
  - `mockApi.getReportDraftByChild(childId: string): Promise<ReportDraft>`
  - `mockApi.getAuditLogs(childId: string): Promise<AuditLog[]>`
- Produces:
  - `ReportGenerationStatus`
  - `ReportSafetyDisplayStatus`
  - `ReportDraft.generation`
  - `ReportDraft.safetyCheck.checkedAt`
  - `ReportDraft.safetyCheck.displayStatus`
  - `ReportDraft.safetyCheck.plainSummary`
  - `ReportDraft.evidenceTrace`
  - `mockApi.generateReportDraft(childId: string): Promise<ReportDraft>`

- [ ] **Step 1: Write failing domain/API tests**

Add these tests to `/Users/yijie/Documents/GitHub/symphony-insight/src/api/mockApi.test.ts`:

```ts
it("returns report generation metadata and traceable sources", async () => {
  await mockApi.resetReviewState();
  const report = await mockApi.getReportDraftByChild("xiaoyu");

  expect(report.generation).toMatchObject({
    id: "generation-xiaoyu-8",
    status: "needs_teacher_review",
    sourceSessionCount: 8,
    sourceRubricCount: 9,
    sourceDomainCount: 6,
    modelLabel: "报告整理助手"
  });
  expect(report.generation.promptVersion).toBe("report-draft-v1-2026-06");
  expect(report.safetyCheck).toMatchObject({
    containsMedicalClaim: false,
    flaggedPhrases: [],
    displayStatus: "passed",
    plainSummary: "没有发现不适合直接使用的表述。"
  });
  expect(report.evidenceTrace.sessionIds).toContain("session-8");
  expect(report.evidenceTrace.rubricIds).toContain("join");
  expect(report.evidenceTrace.referenceIds).toContain("kim-2008");
});

it("generates a fresh report draft and records a system audit entry", async () => {
  await mockApi.resetReviewState();
  const generated = await mockApi.generateReportDraft("xiaoyu");
  const auditLogs = await mockApi.getAuditLogs("xiaoyu");

  expect(generated.childId).toBe("xiaoyu");
  expect(generated.generation.status).toBe("draft_ready");
  expect(generated.generation.generatedAt).not.toBe("2026-06-27T10:10:00+08:00");
  expect(auditLogs[0]).toMatchObject({
    actor: "报告整理助手",
    action: "report.generated",
    targetType: "report",
    targetId: "report-xiaoyu-8",
    summary: "系统整理了一版报告草稿，等老师确认。"
  });
});

it("rejects report draft generation for an unknown child", async () => {
  await expect(mockApi.generateReportDraft("missing-child")).rejects.toThrow("Unknown child: missing-child");
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm test -- src/api/mockApi.test.ts
```

Expected output includes:

```text
FAIL src/api/mockApi.test.ts
Property 'generation' does not exist
```

or:

```text
mockApi.generateReportDraft is not a function
```

- [ ] **Step 3: Extend `src/types/domain.ts`**

Add the new types near `ReportStatus` and replace the existing `ReportDraft` definition with this exact shape:

```ts
export type ReportStatus = "draft" | "teacher_reviewing" | "approved" | "rejected" | "exported";

export type ReportGenerationStatus =
  | "not_started"
  | "generating"
  | "draft_ready"
  | "needs_teacher_review"
  | "approved"
  | "exported"
  | "blocked";

export type ReportSafetyDisplayStatus = "passed" | "needs_edit" | "blocked";

export type ReportDraft = {
  id: string;
  childId: string;
  status: ReportStatus;
  period: {
    start: string;
    end: string;
    sessionCount: number;
  };
  generation: {
    id: string;
    status: ReportGenerationStatus;
    sourceSessionCount: number;
    sourceRubricCount: number;
    sourceDomainCount: number;
    generatedAt: string;
    promptVersion: string;
    modelLabel: string;
  };
  professionalDraft: {
    overview: string;
    motionObservation: string;
    affectObservation: string;
    participationObservation: string;
    reviewPoints: string[];
    limitationNote: string;
  };
  parentSummary: {
    overview: string;
    positiveMoments: string;
    nextObservationFocus: string;
  };
  safetyCheck: {
    containsMedicalClaim: boolean;
    flaggedPhrases: string[];
    checkedAt: string;
    displayStatus: ReportSafetyDisplayStatus;
    plainSummary: string;
  };
  evidenceTrace: {
    sessionIds: string[];
    rubricIds: EvaluationDimension["id"][];
    insightIds: string[];
    referenceIds: string[];
  };
  teacherNote: string;
};
```

- [ ] **Step 4: Update mock reports in `src/data/mockData.ts`**

Add these fields to `reportDraft`:

```ts
  generation: {
    id: "generation-xiaoyu-8",
    status: "needs_teacher_review",
    sourceSessionCount: 8,
    sourceRubricCount: 9,
    sourceDomainCount: 6,
    generatedAt: "2026-06-27T10:10:00+08:00",
    promptVersion: "report-draft-v1-2026-06",
    modelLabel: "报告整理助手"
  },
```

Replace the existing `safetyCheck` block with:

```ts
  safetyCheck: {
    containsMedicalClaim: false,
    flaggedPhrases: [],
    checkedAt: "2026-06-27T10:11:00+08:00",
    displayStatus: "passed",
    plainSummary: "没有发现不适合直接使用的表述。"
  },
```

Add `evidenceTrace` before `teacherNote`:

```ts
  evidenceTrace: {
    sessionIds: ["session-1", "session-2", "session-3", "session-4", "session-5", "session-6", "session-7", "session-8"],
    rubricIds: ["join", "choice", "focus", "respond", "create", "recover", "access", "setting", "goal"],
    insightIds: ["insight-engagement", "insight-recovery", "insight-setting"],
    referenceIds: ["kim-2008", "geretsegger-2022", "gas-1968", "dream-2020", "baxter-2007"]
  },
```

In the two cloned report drafts, override `generation.id` and `evidenceTrace.sessionIds` so IDs remain child-specific:

```ts
    generation: {
      ...reportDraft.generation,
      id: "generation-lele-8"
    },
    evidenceTrace: {
      ...reportDraft.evidenceTrace,
      sessionIds: reportDraft.evidenceTrace.sessionIds.map((id) => id.replace("session", "lele-session"))
    },
```

and:

```ts
    generation: {
      ...reportDraft.generation,
      id: "generation-anan-8"
    },
    evidenceTrace: {
      ...reportDraft.evidenceTrace,
      sessionIds: reportDraft.evidenceTrace.sessionIds.map((id) => id.replace("session", "anan-session"))
    },
```

- [ ] **Step 5: Implement `mockApi.generateReportDraft`**

In `/Users/yijie/Documents/GitHub/symphony-insight/src/api/mockApi.ts`, add this method inside `mockApi`:

```ts
  generateReportDraft(childId: string): Promise<ReportDraft> {
    const report = currentReports.find((item) => item.childId === childId);
    if (!report) throw new Error(`Unknown child: ${childId}`);

    const generatedAt = new Date().toISOString();
    const updatedReport: ReportDraft = {
      ...report,
      status: "teacher_reviewing",
      generation: {
        ...report.generation,
        status: "draft_ready",
        generatedAt
      },
      safetyCheck: {
        ...report.safetyCheck,
        checkedAt: generatedAt,
        displayStatus: report.safetyCheck.containsMedicalClaim ? "blocked" : "passed",
        plainSummary: report.safetyCheck.containsMedicalClaim
          ? "这版草稿暂时不能导出，请先修改标出的表述。"
          : "没有发现不适合直接使用的表述。"
      }
    };

    currentReports = currentReports.map((item) => (item.id === report.id ? updatedReport : item));
    currentAuditLogs = [
      {
        id: `audit-generated-${Date.now()}`,
        childId: updatedReport.childId,
        actor: "报告整理助手",
        action: "report.generated",
        targetType: "report",
        targetId: updatedReport.id,
        createdAt: generatedAt,
        summary: "系统整理了一版报告草稿，等老师确认。"
      },
      ...currentAuditLogs
    ];

    return new Promise((resolve) => window.setTimeout(() => resolve(structuredClone(updatedReport)), 700));
  },
```

- [ ] **Step 6: Run focused tests**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm test -- src/api/mockApi.test.ts
```

Expected output includes:

```text
PASS src/api/mockApi.test.ts
```

- [ ] **Step 7: Commit**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
git add src/types/domain.ts src/data/mockData.ts src/api/mockApi.ts src/api/mockApi.test.ts
git commit -m "feat: add mock report generation contract"
```

---

### Task 2: Add Report Workflow, Source, And Safety Components

**Files:**
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/ReportWorkflowSteps.tsx`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/ReportSourceSummary.tsx`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/ReportSafetyNotice.tsx`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/reportComponents.test.tsx`

**Interfaces:**
- Consumes:
  - `ReportDraft`
  - `ReportStatus`
  - `ReportSafetyDisplayStatus`
  - `useAppStore().language`
- Produces:
  - `<ReportWorkflowSteps report={report} isGenerating={boolean} language={language} />`
  - `<ReportSourceSummary report={report} childId={selectedChildId} language={language} />`
  - `<ReportSafetyNotice safetyCheck={report.safetyCheck} language={language} />`

- [ ] **Step 1: Add failing component tests for report workflow elements**

Create `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/reportComponents.test.tsx`:

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { reportDraft } from "../../data/mockData";
import { ReportSafetyNotice } from "./ReportSafetyNotice";
import { ReportSourceSummary } from "./ReportSourceSummary";
import { ReportWorkflowSteps } from "./ReportWorkflowSteps";

describe("report workflow components", () => {
  it("renders the report workflow steps in teacher-facing language", () => {
    render(<ReportWorkflowSteps report={reportDraft} isGenerating={false} language="zh" />);

    expect(screen.getByText("整理草稿")).toBeInTheDocument();
    expect(screen.getByText("检查表述")).toBeInTheDocument();
    expect(screen.getByText("老师确认")).toBeInTheDocument();
    expect(screen.getByText("导出摘要")).toBeInTheDocument();
  });

  it("renders report sources and links to the scoring guide", () => {
    render(<ReportSourceSummary report={reportDraft} childId="xiaoyu" language="zh" />);

    expect(screen.getByText("草稿来自哪里")).toBeInTheDocument();
    expect(screen.getByText("8 次")).toBeInTheDocument();
    expect(screen.getByText("9 项")).toBeInTheDocument();
    expect(screen.getByText("6 个")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /查看评分说明/ })).toHaveAttribute("href", "#/child/xiaoyu/rubrics");
  });

  it("renders safety check status without technical wording", () => {
    render(<ReportSafetyNotice safetyCheck={reportDraft.safetyCheck} language="zh" />);

    expect(screen.getByText("表述检查通过")).toBeInTheDocument();
    expect(screen.getByText("没有发现不适合直接使用的表述。")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm test -- src/components/report/reportComponents.test.tsx
```

Expected output includes:

```text
Cannot find module './ReportSafetyNotice'
```

- [ ] **Step 3: Create `ReportWorkflowSteps.tsx`**

```tsx
import { CheckCircle2, FileText, ShieldCheck, Upload } from "lucide-react";
import type { ReportDraft } from "../../types/domain";

const steps = [
  { key: "draft", title: "整理草稿", description: "来自活动记录和观察问题", icon: FileText },
  { key: "safety", title: "检查表述", description: "标出不适合直接使用的话", icon: ShieldCheck },
  { key: "review", title: "老师确认", description: "老师可以修改、退回或通过", icon: CheckCircle2 },
  { key: "export", title: "导出摘要", description: "通过后才能给家长", icon: Upload }
] as const;

function getActiveIndex(report: ReportDraft, isGenerating: boolean) {
  if (isGenerating || report.generation.status === "generating") return 0;
  if (report.generation.status === "blocked" || report.safetyCheck.displayStatus === "blocked") return 1;
  if (report.status === "approved") return 3;
  if (report.status === "exported") return 4;
  return 2;
}

export function ReportWorkflowSteps({ report, isGenerating = false }: { report: ReportDraft; isGenerating?: boolean }) {
  const activeIndex = getActiveIndex(report, isGenerating);

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isDone = index < activeIndex;
        const isActive = index === activeIndex || (activeIndex === 4 && index === 3);
        return (
          <div
            key={step.key}
            className={`rounded-2xl border p-4 transition-all duration-200 ${
              isActive
                ? "border-tide/30 bg-tide-50 shadow-card"
                : isDone
                  ? "border-moss/20 bg-moss-50/70"
                  : "border-white/70 bg-white/70"
            } ${isGenerating && index === 0 ? "animate-pulse" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                  isDone ? "bg-moss text-white" : isActive ? "bg-tide text-white" : "bg-paper-warm text-ink-muted"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-sm font-extrabold tracking-tightish">{step.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-ink-muted">{step.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Create `ReportSourceSummary.tsx`**

```tsx
import { BookOpen, ClipboardCheck, FileText, Layers } from "lucide-react";
import type { ReportDraft } from "../../types/domain";
import { Card } from "../ui/Card";

const sourceCards = [
  { key: "sessions", icon: FileText, title: "活动记录", value: (report: ReportDraft) => `${report.generation.sourceSessionCount} 次` },
  { key: "rubrics", icon: ClipboardCheck, title: "观察问题", value: (report: ReportDraft) => `${report.generation.sourceRubricCount} 项` },
  { key: "domains", icon: Layers, title: "观察方向", value: (report: ReportDraft) => `${report.generation.sourceDomainCount} 个` },
  { key: "notes", icon: BookOpen, title: "老师备注", value: () => "已纳入" }
] as const;

export function ReportSourceSummary({ report, childId }: { report: ReportDraft; childId: string }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-extrabold tracking-tightish">草稿来自哪里</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-ink-muted">
            这份草稿来自活动里的记录和老师可复核的评分，不会自动判断孩子情况。
          </p>
        </div>
        <a
          href={`#/child/${childId}/rubrics`}
          className="inline-flex h-9 items-center rounded-xl bg-white/85 px-3 text-sm font-bold text-tide-600 ring-1 ring-inset ring-tide/15 transition hover:bg-tide-50"
        >
          查看评分说明
        </a>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {sourceCards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="rounded-xl border border-white/70 bg-white/75 p-4">
              <Icon className="h-4 w-4 text-tide-600" aria-hidden="true" />
              <p className="mt-3 text-xl font-extrabold tracking-tightish">{item.value(report)}</p>
              <p className="mt-0.5 text-xs font-semibold text-ink-muted">{item.title}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
```

- [ ] **Step 5: Create `ReportSafetyNotice.tsx`**

```tsx
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import type { ReportDraft } from "../../types/domain";

type SafetyCheck = ReportDraft["safetyCheck"];

const toneMap = {
  passed: {
    icon: CheckCircle2,
    className: "border-moss/20 bg-moss-50 text-moss-600",
    title: "表述检查通过"
  },
  needs_edit: {
    icon: AlertTriangle,
    className: "border-sun/30 bg-sun-50 text-[#8a6a22]",
    title: "有几句话建议老师改一下"
  },
  blocked: {
    icon: ShieldAlert,
    className: "border-coral/25 bg-coral-50 text-coral-600",
    title: "这版草稿暂时不能导出"
  }
} as const;

export function ReportSafetyNotice({ safetyCheck }: { safetyCheck: SafetyCheck }) {
  const tone = toneMap[safetyCheck.displayStatus];
  const Icon = tone.icon;

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tone.className}`}>
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-bold">{tone.title}</p>
          <p className="mt-1 leading-6 text-ink-soft">{safetyCheck.plainSummary}</p>
          {safetyCheck.flaggedPhrases.length > 0 ? (
            <p className="mt-2 text-xs font-semibold">建议修改：{safetyCheck.flaggedPhrases.join("、")}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run focused component tests**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm test -- src/components/report/reportComponents.test.tsx
```

Expected output includes:

```text
PASS src/components/report/reportComponents.test.tsx
```

- [ ] **Step 7: Commit component scaffolding**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
git add src/components/report/ReportWorkflowSteps.tsx src/components/report/ReportSourceSummary.tsx src/components/report/ReportSafetyNotice.tsx src/components/report/reportComponents.test.tsx
git commit -m "feat: add report workflow support components"
```

---

### Task 3: Integrate Workflow Into Report Review Page

**Files:**
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/pages/ReportReviewPage.tsx`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/ReportDraftPanel.tsx`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/TeacherReviewPanel.tsx`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/pages/pages.test.tsx`

**Interfaces:**
- Consumes:
  - `mockApi.generateReportDraft(childId: string): Promise<ReportDraft>`
  - `ReportWorkflowSteps`
  - `ReportSourceSummary`
  - `ReportSafetyNotice`
- Produces:
  - Report page with regenerate action
  - `TeacherReviewPanel` props:
    - `report: ReportDraft`
    - `auditLogs: AuditLog[]`
    - `isGenerating: boolean`
    - `onRegenerateDraft: () => void`
    - `onStatusChange: (status: ReportStatus) => void`

- [ ] **Step 1: Add failing interaction assertions**

In `/Users/yijie/Documents/GitHub/symphony-insight/src/pages/pages.test.tsx`, add these assertions to the existing `approves a report and shows user-facing audit copy` test before the approve click:

```ts
    expect(screen.getByText("整理草稿")).toBeInTheDocument();
    expect(screen.getByText("检查表述")).toBeInTheDocument();
    expect(screen.getByText("老师确认")).toBeInTheDocument();
    expect(screen.getByText("导出摘要")).toBeInTheDocument();
    expect(screen.getByText("8 次")).toBeInTheDocument();
    expect(screen.getByText("9 项")).toBeInTheDocument();
    expect(screen.getByText("6 个")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /查看评分说明/ })).toHaveAttribute("href", "#/child/xiaoyu/rubrics");
    expect(screen.getByText("没有发现不适合直接使用的表述。")).toBeInTheDocument();
```

Add this new test after the report approval test:

```ts
  it("regenerates the report draft and shows a user-facing system audit entry", async () => {
    const user = userEvent.setup();
    render(<ReportReviewPage />);

    expect(await screen.findByText(/老师看的详细版/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /重新整理草稿/ }));

    await waitFor(() => expect(screen.getByText(/系统整理了一版报告草稿/)).toBeInTheDocument());
    expect(screen.getByText(/报告整理助手/)).toBeInTheDocument();
    expect(screen.getByText(/没有发现不适合直接使用的表述/)).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run tests to verify failure**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm test -- src/pages/pages.test.tsx
```

Expected output includes:

```text
Unable to find role="button" and name `/重新整理草稿/`
```

- [ ] **Step 3: Update `ReportReviewPage.tsx`**

Replace the component implementation with:

```tsx
import { useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";
import { ReportDraftPanel } from "../components/report/ReportDraftPanel";
import { ReportSourceSummary } from "../components/report/ReportSourceSummary";
import { ReportWorkflowSteps } from "../components/report/ReportWorkflowSteps";
import { TeacherReviewPanel } from "../components/report/TeacherReviewPanel";
import { t } from "../i18n";
import { useAppStore } from "../store/useAppStore";
import type { AuditLog, ReportDraft, ReportStatus } from "../types/domain";

export function ReportReviewPage() {
  const [report, setReport] = useState<ReportDraft | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { language, selectedChildId } = useAppStore();

  const refresh = () => {
    Promise.all([mockApi.getReportDraftByChild(selectedChildId), mockApi.getAuditLogs(selectedChildId)]).then(([reportData, auditData]) => {
      setReport(reportData);
      setAuditLogs(auditData);
    });
  };

  useEffect(() => {
    refresh();
  }, [selectedChildId]);

  const updateStatus = (status: ReportStatus) => {
    if (!report) return;
    mockApi.updateReportStatus(report.id, status, "陈老师").then(refresh);
  };

  const regenerateDraft = () => {
    setIsGenerating(true);
    mockApi.generateReportDraft(selectedChildId).then((updatedReport) => {
      setReport(updatedReport);
      mockApi.getAuditLogs(selectedChildId).then(setAuditLogs).finally(() => setIsGenerating(false));
    });
  };

  if (!report) return <div>{language === "zh" ? "报告加载中" : "Loading report"}</div>;

  return (
    <div className="space-y-6 page-enter">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">{t(language, "report")}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tightish md:text-4xl">{t(language, "reportTitle")}</h1>
        <p className="mt-2 max-w-3xl text-ink-muted">{t(language, "reportIntro")}</p>
      </div>
      <ReportWorkflowSteps report={report} isGenerating={isGenerating} />
      <ReportSourceSummary report={report} childId={selectedChildId} />
      <TeacherReviewPanel
        report={report}
        auditLogs={auditLogs}
        isGenerating={isGenerating}
        onRegenerateDraft={regenerateDraft}
        onStatusChange={updateStatus}
      />
      <ReportDraftPanel report={report} />
    </div>
  );
}
```

- [ ] **Step 4: Update `TeacherReviewPanel.tsx`**

Replace its props and add the safety/regenerate UI:

```tsx
export function TeacherReviewPanel({
  report,
  auditLogs,
  isGenerating,
  onRegenerateDraft,
  onStatusChange
}: {
  report: ReportDraft;
  auditLogs: AuditLog[];
  isGenerating: boolean;
  onRegenerateDraft: () => void;
  onStatusChange: (status: ReportStatus) => void;
}) {
```

Import `RefreshCw` and `ReportSafetyNotice`:

```tsx
import { RefreshCw } from "lucide-react";
import { ReportSafetyNotice } from "./ReportSafetyNotice";
```

Insert this block after the review note:

```tsx
      <div className="mt-4">
        <ReportSafetyNotice safetyCheck={report.safetyCheck} />
      </div>
```

Insert this button before `继续编辑`:

```tsx
        <Button onClick={onRegenerateDraft} disabled={isGenerating}>
          <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} aria-hidden="true" />
          {isGenerating ? "正在整理草稿" : "重新整理草稿"}
        </Button>
```

Update the export disabled condition:

```tsx
disabled={report.status !== "approved" || report.safetyCheck.displayStatus === "blocked"}
```

- [ ] **Step 5: Update `ReportDraftPanel.tsx`**

Add `Badge` import:

```tsx
import { Badge } from "../ui/Badge";
```

Add badges in the two card headers:

```tsx
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-extrabold tracking-tightish">老师看的详细版</h3>
          <Badge tone="tide">系统整理的草稿</Badge>
        </div>
```

For the parent summary header:

```tsx
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-extrabold tracking-tightish">给家长看的摘要</h3>
          <Badge tone={report.status === "approved" || report.status === "exported" ? "moss" : "coral"}>
            {report.status === "approved" || report.status === "exported" ? "老师确认后可导出" : "确认前不导出"}
          </Badge>
        </div>
```

Replace the parent summary body with blocked-aware rendering:

```tsx
        {report.safetyCheck.displayStatus === "blocked" ? (
          <p className="mt-4 rounded-xl border border-coral/20 bg-coral-50 p-4 text-sm leading-6 text-ink-soft">
            这版草稿里有不适合直接给家长看的表述，需要老师修改后再导出。
          </p>
        ) : (
          <div className="mt-4 space-y-4 text-sm leading-6 text-ink-soft">
            <p>{formatReportCopy(report.parentSummary.overview)}</p>
            <p>{formatReportCopy(report.parentSummary.positiveMoments)}</p>
            <p>{formatReportCopy(report.parentSummary.nextObservationFocus)}</p>
          </div>
        )}
```

- [ ] **Step 6: Run focused page tests**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm test -- src/pages/pages.test.tsx
```

Expected output includes:

```text
PASS src/pages/pages.test.tsx
```

- [ ] **Step 7: Commit**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
git add src/pages/ReportReviewPage.tsx src/components/report/ReportDraftPanel.tsx src/components/report/TeacherReviewPanel.tsx src/pages/pages.test.tsx
git commit -m "feat: integrate report review workflow"
```

---

### Task 4: Add Report Method Page, Route, Sidebar, And I18n

**Files:**
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/report/ReportMethodFlow.tsx`
- Create: `/Users/yijie/Documents/GitHub/symphony-insight/src/pages/ReportMethodPage.tsx`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/app/routes.tsx`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/components/layout/Sidebar.tsx`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/i18n.ts`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/pages/pages.test.tsx`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/test/smoke.test.ts`

**Interfaces:**
- Consumes:
  - `useAppStore().selectedChildId`
  - `useAppStore().language`
  - existing `Card`, `Button`, `Badge`
- Produces:
  - `<ReportMethodFlow />`
  - `<ReportMethodPage />`
  - route `#/child/:childId/report-method`
  - sidebar item `reportMethod`

- [ ] **Step 1: Add failing route/page test**

In `/Users/yijie/Documents/GitHub/symphony-insight/src/pages/pages.test.tsx`, import `ReportMethodPage`:

```ts
import { ReportMethodPage } from "./ReportMethodPage";
```

Add this test:

```ts
  it("renders the report method page and links back to rubric evidence", () => {
    useAppStore.getState().setSelectedChildId("xiaoyu");
    render(<ReportMethodPage />);

    expect(screen.getByText("报告怎么来的")).toBeInTheDocument();
    expect(screen.getByText("活动中留下记录")).toBeInTheDocument();
    expect(screen.getByText("生成报告草稿")).toBeInTheDocument();
    expect(screen.getByText("把结构化记录写成草稿")).toBeInTheDocument();
    expect(screen.getByText("不诊断")).toBeInTheDocument();
    expect(screen.getByText("不读取原始音视频")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /查看评分说明/ })).toHaveAttribute("href", "#/child/xiaoyu/rubrics");
    expect(screen.getByText("更详细的系统说明")).toBeInTheDocument();
    expect(screen.queryByText("康复有效")).not.toBeInTheDocument();
    expect(screen.queryByText("恢复正常")).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Add failing route smoke test**

Replace `/Users/yijie/Documents/GitHub/symphony-insight/src/test/smoke.test.ts` with:

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { resolveRoute } from "../app/routes";
import { useAppStore } from "../store/useAppStore";

describe("route smoke tests", () => {
  it("renders the report method route", () => {
    useAppStore.getState().setLanguage("zh");
    useAppStore.getState().setSelectedChildId("xiaoyu");
    render(resolveRoute("#/child/xiaoyu/report-method"));

    expect(screen.getByText("报告怎么来的")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run tests to verify failure**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm test -- src/pages/pages.test.tsx src/test/smoke.test.ts
```

Expected output includes:

```text
Cannot find module './ReportMethodPage'
```

- [ ] **Step 4: Create `ReportMethodFlow.tsx`**

```tsx
import { CheckCircle2, ClipboardList, FileText, ShieldCheck, Upload } from "lucide-react";

const flowSteps = [
  { title: "活动中留下记录", body: "记录参与、回应、暂停、恢复和老师提示。", icon: ClipboardList },
  { title: "整理成观察指标", body: "把活动记录汇总到 9 项观察问题。", icon: CheckCircle2 },
  { title: "生成报告草稿", body: "把结构化记录写成老师可改的草稿。", icon: FileText },
  { title: "检查不合适表述", body: "标出不适合直接给家长看的话。", icon: ShieldCheck },
  { title: "老师确认后导出", body: "老师确认后，摘要才可以给家长。", icon: Upload }
] as const;

export function ReportMethodFlow() {
  return (
    <div className="grid gap-3 lg:grid-cols-5">
      {flowSteps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.title} className="rounded-2xl border border-white/70 bg-white/75 p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-card">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-tide-50 text-tide-600">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="mt-3 text-xs font-bold text-ink-muted">第 {index + 1} 步</p>
            <h3 className="mt-1 font-display text-base font-extrabold tracking-tightish">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{step.body}</p>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 5: Create `ReportMethodPage.tsx`**

```tsx
import { Brain, CheckCircle2, ExternalLink, ShieldCheck, XCircle } from "lucide-react";
import { ReportMethodFlow } from "../components/report/ReportMethodFlow";
import { Card } from "../components/ui/Card";
import { useAppStore } from "../store/useAppStore";

const canDo = ["把结构化记录写成草稿", "把专业表述改得更容易读", "检查有没有不该直接使用的话"];
const cannotDo = ["不诊断", "不判断病情变好或变坏", "不自动给家长发送", "不替代老师判断", "不读取原始音视频"];
const sources = ["活动次数", "观察问题", "评分依据", "老师备注", "生成记录", "审核记录"];

export function ReportMethodPage() {
  const { selectedChildId } = useAppStore();

  return (
    <div className="space-y-6 page-enter">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">报告说明</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tightish md:text-4xl">报告怎么来的</h1>
        <p className="mt-2 max-w-3xl text-ink-muted">系统只整理活动记录，最后怎么看、怎么发，仍然由老师决定。</p>
      </div>

      <ReportMethodFlow />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-tide-600" aria-hidden="true" />
            <h2 className="font-display text-lg font-extrabold tracking-tightish">会做什么</h2>
          </div>
          <div className="mt-4 space-y-2">
            {canDo.map((item) => (
              <p key={item} className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/75 px-3 py-2 text-sm font-semibold text-ink-soft">
                <CheckCircle2 className="h-4 w-4 text-moss-600" aria-hidden="true" />
                {item}
              </p>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-coral-600" aria-hidden="true" />
            <h2 className="font-display text-lg font-extrabold tracking-tightish">不会做什么</h2>
          </div>
          <div className="mt-4 space-y-2">
            {cannotDo.map((item) => (
              <p key={item} className="flex items-center gap-2 rounded-xl border border-white/70 bg-paper-warm/80 px-3 py-2 text-sm font-semibold text-ink-soft">
                <XCircle className="h-4 w-4 text-coral-600" aria-hidden="true" />
                {item}
              </p>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-extrabold tracking-tightish">这份报告用了哪些资料</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">评分依据来自现有评分说明页，那里保留每项分数、行为、数据和文献依据。</p>
          </div>
          <a
            href={`#/child/${selectedChildId}/rubrics`}
            className="inline-flex h-9 items-center gap-1 rounded-xl bg-white/85 px-3 text-sm font-bold text-tide-600 ring-1 ring-inset ring-tide/15 transition hover:bg-tide-50"
          >
            查看评分说明
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <div key={source} className="rounded-xl border border-white/70 bg-white/75 p-3 text-sm font-bold text-ink-soft">
              {source}
            </div>
          ))}
        </div>
      </Card>

      <details className="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-card">
        <summary className="cursor-pointer font-display text-base font-extrabold tracking-tightish">更详细的系统说明</summary>
        <div className="mt-4 space-y-2 text-sm leading-6 text-ink-soft">
          <p>AI 网关统一管理报告草稿服务。</p>
          <p>密钥只在后端保存，前端不会直接调用模型。</p>
          <p>生成结果会保存版本、检查结果和操作记录。</p>
          <p>当前前端使用 mock 服务模拟生成过程。</p>
          <p>后端接入真实模型服务时，页面结构不需要重做。</p>
          <p>9 项观察问题的评分不会调用 AI。</p>
        </div>
      </details>
    </div>
  );
}
```

- [ ] **Step 6: Add route and sidebar navigation**

Update `/Users/yijie/Documents/GitHub/symphony-insight/src/app/routes.tsx`:

```tsx
import { ReportMethodPage } from "../pages/ReportMethodPage";
```

Add before the `/report` route:

```tsx
  if (hash.endsWith("/report-method")) return <ReportMethodPage />;
```

Update `/Users/yijie/Documents/GitHub/symphony-insight/src/components/layout/Sidebar.tsx`:

```tsx
import { BookOpen, CalendarDays, FileCheck2, HelpCircle, Home, Languages, ShieldCheck, SlidersHorizontal } from "lucide-react";
```

Add item in the Manage group after report:

```ts
      { suffix: "/report-method", labelKey: "reportMethod", icon: HelpCircle },
```

- [ ] **Step 7: Add i18n labels**

In `/Users/yijie/Documents/GitHub/symphony-insight/src/i18n.ts`, add to `zh`:

```ts
    reportMethod: "报告怎么来的",
    reportMethodTitle: "报告怎么来的",
    reportMethodIntro: "系统只整理活动记录，最后怎么看、怎么发，仍然由老师决定。",
    reportWorkflowDraft: "整理草稿",
    reportWorkflowSafety: "检查表述",
    reportWorkflowReview: "老师确认",
    reportWorkflowExport: "导出摘要",
    regenerateDraft: "重新整理草稿",
    draftSourceTitle: "草稿来自哪里",
    safetyPassed: "没有发现不适合直接使用的表述。",
    safetyNeedsEdit: "有几句话建议老师改一下。",
    safetyBlocked: "这版草稿暂时不能导出，请先修改标出的表述。"
```

Add to `en`:

```ts
    reportMethod: "How Reports Work",
    reportMethodTitle: "How Reports Work",
    reportMethodIntro: "The system organizes activity records; teachers decide how to review and share them.",
    reportWorkflowDraft: "System-prepared draft",
    reportWorkflowSafety: "Expression check",
    reportWorkflowReview: "Teacher review",
    reportWorkflowExport: "Parent export",
    regenerateDraft: "Regenerate draft",
    draftSourceTitle: "Draft sources",
    safetyPassed: "No wording was found that should be held back from parent-facing use.",
    safetyNeedsEdit: "A few sentences should be checked by the teacher.",
    safetyBlocked: "This draft cannot be exported until the highlighted wording is edited."
```

- [ ] **Step 8: Run focused route/page tests**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm test -- src/pages/pages.test.tsx src/test/smoke.test.ts
```

Expected output includes:

```text
PASS src/pages/pages.test.tsx
PASS src/test/smoke.test.ts
```

- [ ] **Step 9: Commit**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
git add src/components/report/ReportMethodFlow.tsx src/pages/ReportMethodPage.tsx src/app/routes.tsx src/components/layout/Sidebar.tsx src/i18n.ts src/pages/pages.test.tsx src/test/smoke.test.ts
git commit -m "feat: add report method explanation page"
```

---

### Task 5: Copy Safety, Full Test Suite, And Build Verification

**Files:**
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/pages/pages.test.tsx`
- Modify: `/Users/yijie/Documents/GitHub/symphony-insight/src/test/smoke.test.ts`

**Interfaces:**
- Consumes all components and API changes from Tasks 1-4.
- Produces verified frontend with passing tests and production build.

- [ ] **Step 1: Add final copy-safety assertions**

In `/Users/yijie/Documents/GitHub/symphony-insight/src/pages/pages.test.tsx`, update `forbiddenPhrases` to include:

```ts
  "LLM",
  "API",
  "provider",
  "prompt",
  "payload",
  "model id",
```

Keep the existing medical-risk phrases:

```ts
  "诊断",
  "疗效",
  "病情好转",
  "病情恶化",
  "康复有效",
  "恢复正常"
```

Do not apply `expectNoForbiddenCopy` to the expanded technical details section after opening it, because the spec allows `AI 网关` and `mock 服务` there. The default rendered page with details closed must pass.

- [ ] **Step 2: Add report-method route to smoke coverage**

Append this test to `/Users/yijie/Documents/GitHub/symphony-insight/src/test/smoke.test.ts`:

```ts
  it("renders the report review route without blank content", async () => {
    useAppStore.getState().setLanguage("zh");
    useAppStore.getState().setSelectedChildId("xiaoyu");
    render(resolveRoute("#/child/xiaoyu/report"));

    expect(await screen.findByText("活动报告")).toBeInTheDocument();
    expect(await screen.findByText("整理草稿")).toBeInTheDocument();
  });
```

- [ ] **Step 3: Run full tests**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm test
```

Expected output includes:

```text
Test Files  8 passed
```

The exact number can be higher if more tests exist; every test file must pass.

- [ ] **Step 4: Run production build**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm run build
```

Expected output includes:

```text
✓ built
```

- [ ] **Step 5: Manual browser verification**

Start or reuse the local Vite server:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
npm run dev -- --host 127.0.0.1 --port 5173
```

Check:

```text
http://localhost:5173/#/child/xiaoyu/report
```

Must show:

```text
整理草稿
检查表述
老师确认
导出摘要
8 次活动记录
9 项观察问题
6 个观察方向
重新整理草稿
没有发现不适合直接使用的表述。
```

Click `查看评分说明`; it must navigate to:

```text
http://localhost:5173/#/child/xiaoyu/rubrics
```

Check:

```text
http://localhost:5173/#/child/xiaoyu/report-method
```

Must show:

```text
报告怎么来的
活动中留下记录
生成报告草稿
不读取原始音视频
更详细的系统说明
```

Default visible copy must not show raw technical terms or positive medical claims:

```text
LLM
API
provider
prompt
payload
model id
病情好转
康复有效
恢复正常
```

The report-method page may show negated boundary copy such as `不诊断` and `不判断病情变好或变坏`.

- [ ] **Step 6: Confirm git state**

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
git status --short
```

Expected output:

```text

```

- [ ] **Step 7: Commit final verification updates**

If Step 1 or Step 2 changed test files after the previous commits:

```bash
cd /Users/yijie/Documents/GitHub/symphony-insight
git add src/pages/pages.test.tsx src/test/smoke.test.ts
git commit -m "test: verify report workflow copy and routes"
```

If `git status --short` is empty, no commit is needed for this task.
