# Premium Observation Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按 `docs/superpowers/specs/2026-06-27-premium-observation-dashboard-design.md` 把现有前端升级为中文优先、高端、用户能读懂的儿童观察看板。

**Architecture:** 保持 Vite + React + TypeScript + mock API 的前端-only 架构，不接后端、不引入重型可视化库。新增展示层数据映射文件，把现有 `EvaluationDimension` 转成普通用户能理解的 `DisplayRubric`，首页组件消费该展示数据；活动记录、状态变化、报告审核页只改表现层和安全语言。

**Tech Stack:** React 19、TypeScript 5、Vite 6、Vitest 4、Tailwind CSS、lucide-react、现有 mock API。

## Global Constraints

- 中文界面禁用可见词：`Session`、`Motion`、`Affect`、`seed`、`confidence`、`dimension`、`rubric`、`matrix`、`trace`、`claim`、`AI 自动判断`、`诊断`、`疗效`、`康复有效`、`恢复正常`。
- 中文主导航必须使用：`总览`、`活动记录`、`状态变化`、`报告审核`。
- 首页必须出现：`9 项观察总览`、`今天先看这 3 件事`、`活动记录 8 次`、`创作片段 20 个`、`最近状态 投入`、`老师复核 陈老师`。
- 评分必须用 1-5 分，并配普通话解释、观察依据和状态标签。
- 所有结论必须保持“观察材料/老师复核”语气，不能变成医疗判断或自动诊断。
- 搜索框必须有真实客户端过滤能力，不能只是装饰。
- 动效只使用 CSS transform/opacity/filter，尊重 `prefers-reduced-motion`，不引入重型动画库。
- 测试必须覆盖中文禁用词、首页核心文案、活动记录替代表达、状态变化页目标、报告审核安全语言。
- 最终必须通过：`npm test -- --run`、`npm run build`、`npm audit --audit-level=moderate`。

---

## File Structure

- Create `src/lib/displayRubrics.ts`: 负责把 `EvaluationDimension[]` 映射成 `DisplayRubric[]` 和首页搜索过滤数据。
- Create `src/lib/displayRubrics.test.ts`: 覆盖分数标签、状态标签、禁用词扫描。
- Create `src/components/overview/ImmersiveHero.tsx`: 首页首屏沉浸背景、玻璃导航感标题、搜索/控制区域。
- Create `src/components/overview/ObservationScoreRing.tsx`: 9 项评分环形/分段可视化。
- Create `src/components/overview/ObservationScoreCard.tsx`: 单项评分卡，含分数、状态、解释、观察依据、评分指南。
- Create `src/components/overview/ReviewFocusPanel.tsx`: “今天先看这 3 件事”。
- Create `src/components/state/SettingFitPanel.tsx`: 状态变化页的设置适配卡。
- Modify `src/i18n.ts`: 统一中文导航、页面标题、按钮和安全语言。
- Modify `src/components/layout/AppShell.tsx`: 去侧边栏 demo 感，改为顶部玻璃导航、中文导航、儿童切换、语言切换、安全提示。
- Modify `src/pages/OverviewPage.tsx`: 使用新首页组件、搜索状态和展示层 rubric。
- Modify `src/pages/SessionTimelinePage.tsx`: 改为“活动记录”，移除 `Session` 可见文案。
- Modify `src/components/session/SessionTimeline.tsx`: 改为故事卡/片段式活动记录，使用“第 N 次活动”。
- Modify `src/pages/MotionAffectPage.tsx`: 改为“状态变化”，解释“什么设置更适合孩子”。
- Modify `src/components/charts/MotionAffectMatrix.tsx`: 从中文主流程移除；若保留组件，中文不显示 matrix/motion/affect。
- Modify `src/components/report/TeacherReviewPanel.tsx`: 改为“老师确认后再导出”，隐藏 `report.approved` 这类内部状态码。
- Modify `src/components/report/ReportDraftPanel.tsx`: 改“家长摘要版”为“给家长看的摘要”。
- Modify `src/styles.css`: 高端视觉、玻璃质感、轻动效、响应式约束、reduced motion。
- Modify `vitest.config.ts`: 排除 `.worktrees/**`，防止主 checkout 扫到 worktree 测试副本。
- Modify `src/pages/pages.test.tsx` and `src/app/App.test.tsx`: 更新验收断言。

---

### Task 1: 测试基线和中文术语护栏

**Files:**
- Modify: `vitest.config.ts`
- Modify: `src/pages/pages.test.tsx`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Consumes: 现有 `App`、页面组件和 Vitest 配置。
- Produces: 中文禁用词断言函数 `expectNoForbiddenCopy(container)`，后续页面实现必须满足。

- [ ] **Step 1: 更新 Vitest 排除项**

```ts
// vitest.config.ts
test: {
  environment: "jsdom",
  globals: true,
  setupFiles: "./vitest.setup.ts",
  exclude: ["**/node_modules/**", "**/dist/**", "**/.worktrees/**"]
}
```

- [ ] **Step 2: 更新页面测试禁用词**

```ts
const forbiddenPhrases = [
  "Session",
  "Motion",
  "Affect",
  "seed",
  "confidence",
  "dimension",
  "rubric",
  "matrix",
  "trace",
  "claim",
  "AI 自动判断",
  "诊断",
  "疗效",
  "康复有效",
  "恢复正常"
];
```

- [ ] **Step 3: 写出本轮目标断言**

```ts
expect(screen.getByText(/9 项观察总览/)).toBeInTheDocument();
expect(screen.getByText(/今天先看这 3 件事/)).toBeInTheDocument();
expect(screen.getByText(/活动记录/)).toBeInTheDocument();
expect(screen.queryByText(/Session/)).not.toBeInTheDocument();
expect(screen.getByText(/什么设置更适合孩子/)).toBeInTheDocument();
expect(screen.getByText(/老师确认后再导出/)).toBeInTheDocument();
```

- [ ] **Step 4: 运行测试确认失败**

Run: `npm test -- --run src/pages/pages.test.tsx src/app/App.test.tsx`

Expected: FAIL，失败点集中在旧文案和新组件尚未实现。

---

### Task 2: 展示层评分数据

**Files:**
- Create: `src/lib/displayRubrics.ts`
- Create: `src/lib/displayRubrics.test.ts`

**Interfaces:**
- Consumes: `EvaluationDimension` from `src/types/domain.ts`
- Produces:

```ts
export type DisplayRubric = {
  id: EvaluationDimension["id"];
  title: string;
  score: number;
  scoreLabel: string;
  statusLabel: string;
  plainExplanation: string;
  primaryObservable: string;
  tone: "low" | "medium" | "stable" | "strong";
  sourceLabel: string;
  guide: string[];
};

export function getDisplayRubrics(dimensions: EvaluationDimension[], language: Language): DisplayRubric[];
export function filterDisplayRubrics(rubrics: DisplayRubric[], query: string): DisplayRubric[];
```

- [ ] **Step 1: 写展示数据测试**

```ts
expect(getDisplayRubrics([{ ...dimension, score: 4 }], "zh")[0]).toMatchObject({
  scoreLabel: "4/5",
  statusLabel: "比较稳定"
});
expect(filterDisplayRubrics(rubrics, "参与")).toHaveLength(1);
expect(JSON.stringify(rubrics)).not.toContain("rubric");
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/lib/displayRubrics.test.ts`

Expected: FAIL，模块不存在。

- [ ] **Step 3: 实现展示层映射**

状态标签规则：
- `score < 2`: `暂时困难`
- `score < 3`: `需要较多支持`
- `score < 4`: `需要一点支持`
- `score < 5`: `比较稳定`
- `score >= 5`: `很稳定`

色调规则：
- `score < 2.5`: `low`
- `score < 3.5`: `medium`
- `score < 4.5`: `stable`
- `score >= 4.5`: `strong`

- [ ] **Step 4: 运行展示数据测试**

Run: `npm test -- --run src/lib/displayRubrics.test.ts`

Expected: PASS。

---

### Task 3: 高端首页和 9 项评分可视化

**Files:**
- Create: `src/components/overview/ImmersiveHero.tsx`
- Create: `src/components/overview/ObservationScoreRing.tsx`
- Create: `src/components/overview/ObservationScoreCard.tsx`
- Create: `src/components/overview/ReviewFocusPanel.tsx`
- Modify: `src/pages/OverviewPage.tsx`
- Modify: `src/styles.css`
- Modify: `src/pages/pages.test.tsx`

**Interfaces:**
- Consumes: `DisplayRubric[]` and `filterDisplayRubrics()`.
- Produces: `OverviewPage` with `searchQuery` state and visible premium dashboard structure.

- [ ] **Step 1: 写首页测试目标**

```ts
expect(screen.getByRole("searchbox", { name: /搜索观察内容/ })).toBeInTheDocument();
expect(screen.getByText(/9 项观察总览/)).toBeInTheDocument();
expect(screen.getByText(/4\/5/)).toBeInTheDocument();
await user.type(screen.getByRole("searchbox", { name: /搜索观察内容/ }), "参与");
expect(screen.getByText(/愿不愿意参与/)).toBeInTheDocument();
```

- [ ] **Step 2: 运行首页测试确认失败**

Run: `npm test -- --run src/pages/pages.test.tsx`

Expected: FAIL，首页新结构尚不存在。

- [ ] **Step 3: 实现新首页组件**

实现要求：
- 首屏用 `premium-shell`、`immersive-hero`、`glass-nav`、`overview-dashboard-grid` 等 class。
- 搜索框 `aria-label="搜索观察内容"`，过滤评分卡和观察发现。
- `ObservationScoreRing` 使用 SVG，9 个 segment，hover/focus 显示标题和分数。
- `ObservationScoreCard` 每张卡显示 `title`、`scoreLabel`、`statusLabel`、`plainExplanation`、`primaryObservable`、`guide`。
- `ReviewFocusPanel` 显示三项：`参与和表达更稳定`、`高亮动画需要复核`、`下一次活动建议`。

- [ ] **Step 4: 运行首页测试**

Run: `npm test -- --run src/pages/pages.test.tsx`

Expected: Overview 相关断言 PASS。

---

### Task 4: 活动记录页用户化表达

**Files:**
- Modify: `src/pages/SessionTimelinePage.tsx`
- Modify: `src/components/session/SessionTimeline.tsx`
- Modify: `src/i18n.ts`
- Modify: `src/pages/pages.test.tsx`

**Interfaces:**
- Consumes: `SessionSummary[]` from `mockApi.getSessions`.
- Produces: 中文页面只出现 `第 N 次活动`，不出现 `Session`、`warmup`、`reveal`。

- [ ] **Step 1: 写活动记录测试**

```ts
expect(await screen.findByText(/第 6 次活动/)).toBeInTheDocument();
expect(screen.getByText(/高亮动画出现后退出/)).toBeInTheDocument();
expect(screen.queryByText(/Session/)).not.toBeInTheDocument();
expect(screen.queryByText(/warmup|reveal|capture_seed/)).not.toBeInTheDocument();
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/pages/pages.test.tsx`

Expected: FAIL，旧页面仍出现 `Session`。

- [ ] **Step 3: 改页面与卡片**

活动卡字段：
- 顶部：`第 ${session.index} 次活动`
- 日期：`2026-06-27`
- 三列指标：`主动动作`、`创作片段`、`回到活动`
- 说明区域：`发生了什么`、`哪些支持有帮助`、`需要老师再看`

- [ ] **Step 4: 运行活动记录测试**

Run: `npm test -- --run src/pages/pages.test.tsx`

Expected: PASS。

---

### Task 5: 状态变化页替换动作-情绪矩阵

**Files:**
- Create: `src/components/state/SettingFitPanel.tsx`
- Modify: `src/pages/MotionAffectPage.tsx`
- Modify: `src/i18n.ts`
- Modify: `src/pages/pages.test.tsx`

**Interfaces:**
- Consumes: `SessionSummary[]` and `LongitudinalInsight[]`.
- Produces: `SettingFitPanel` cards for `音乐和节奏`、`画面亮度`、`老师支持方式`。

- [ ] **Step 1: 写状态变化测试**

```ts
expect(await screen.findByText(/什么设置更适合孩子/)).toBeInTheDocument();
expect(screen.getByText(/音乐和节奏/)).toBeInTheDocument();
expect(screen.getByText(/画面亮度/)).toBeInTheDocument();
expect(screen.getByText(/老师支持方式/)).toBeInTheDocument();
expect(screen.queryByText(/动作-情绪关联|matrix|Motion|Affect/)).not.toBeInTheDocument();
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/pages/pages.test.tsx`

Expected: FAIL，旧矩阵页面仍在。

- [ ] **Step 3: 实现 `SettingFitPanel` 和页面布局**

每个设置卡显示：
- `title`
- `fitLabel`，例如 `更适合`
- `evidence`
- `nextStep`
- 小型趋势条，仅用 CSS，不引入新依赖。

- [ ] **Step 4: 运行状态变化测试**

Run: `npm test -- --run src/pages/pages.test.tsx`

Expected: PASS。

---

### Task 6: 报告审核和 AppShell 统一语言

**Files:**
- Modify: `src/components/layout/AppShell.tsx`
- Modify: `src/components/report/TeacherReviewPanel.tsx`
- Modify: `src/components/report/ReportDraftPanel.tsx`
- Modify: `src/pages/ReportReviewPage.tsx`
- Modify: `src/i18n.ts`
- Modify: `src/app/App.test.tsx`
- Modify: `src/pages/pages.test.tsx`

**Interfaces:**
- Consumes: `ReportDraft` and `AuditLog[]`.
- Produces: 中文可见文案无内部状态码；英语切换仍可用。

- [ ] **Step 1: 写 AppShell 和报告测试**

```ts
expect(screen.getByRole("link", { name: /总览/ })).toBeInTheDocument();
expect(screen.getByRole("link", { name: /活动记录/ })).toBeInTheDocument();
expect(screen.getByRole("link", { name: /状态变化/ })).toBeInTheDocument();
expect(screen.getByText(/老师确认后再导出/)).toBeInTheDocument();
expect(screen.queryByText(/report.approved/)).not.toBeInTheDocument();
expect(screen.getByText(/给家长看的摘要/)).toBeInTheDocument();
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/app/App.test.tsx src/pages/pages.test.tsx`

Expected: FAIL，旧导航和旧报告文案仍在。

- [ ] **Step 3: 实现统一语言**

要求：
- 中文导航：`总览`、`活动记录`、`状态变化`、`报告审核`。
- 安全提示：`这里只整理活动观察，导出前需要老师确认。`
- 按钮：`编辑草稿`、`退回修改`、`确认通过`、`导出摘要`。
- 审核记录把内部 action 映射为：`老师已确认`、`继续编辑中`、`已退回修改`、`已导出`。

- [ ] **Step 4: 运行 AppShell 和报告测试**

Run: `npm test -- --run src/app/App.test.tsx src/pages/pages.test.tsx`

Expected: PASS。

---

### Task 7: 最终验证、构建和提交

**Files:**
- All modified files.

**Interfaces:**
- Consumes: 所有前面任务产物。
- Produces: 可运行前端、通过测试、通过生产构建、通过 audit。

- [ ] **Step 1: 全量测试**

Run: `npm test -- --run`

Expected: PASS，且只扫描当前 worktree 的测试文件。

- [ ] **Step 2: 生产构建**

Run: `npm run build`

Expected: PASS，生成 `dist/`。

- [ ] **Step 3: 安全审计**

Run: `npm audit --audit-level=moderate`

Expected: `found 0 vulnerabilities`。

- [ ] **Step 4: 浏览器本地检查**

Run: `npm run dev -- --host 127.0.0.1 --port 5174`

Expected:
- `http://127.0.0.1:5174/` 可打开。
- 首屏出现高端沉浸视觉和 `9 项观察总览`。
- 中文页面没有 `Session`、`Motion`、`Affect` 等禁用词。

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat: implement premium observation dashboard"
```

Expected: branch `premium-dashboard-redesign` 包含本轮实现提交。

---

## Self-Review

- Spec coverage: 覆盖中文术语规范、首页首屏、摘要卡、9 项评分可视化、评分卡、三项复核、活动记录、状态变化、报告审核、动效、可访问性、性能、测试和验收标准。
- Placeholder scan: 无 `TBD`、`TODO`、`implement later`、`similar to` 等占位表达。
- Type consistency: `DisplayRubric` 在数据映射、评分环和评分卡中保持同一签名；页面测试只断言用户可见结果，不绑定内部实现细节。
