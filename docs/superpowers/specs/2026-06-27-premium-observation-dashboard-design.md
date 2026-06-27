# Premium Observation Dashboard Design

## Goal

Transform the current SymPhony Insight frontend from a prototype-style dashboard into a premium, user-friendly observation product for teachers and caregivers.

The redesigned Chinese experience must feel like a polished product, not a demo. It must avoid internal engineering terms, explain every score in plain language, and present the 9 observation rubrics as clear visual insight rather than dense text cards.

## Audience

Primary users:

- Special education teachers reviewing a child's music co-creation activities.
- Caregivers reading teacher-approved summaries.
- Product/demo viewers judging whether SymPhony Insight is credible and high-end.

Secondary users:

- Product operators checking whether the prototype has a coherent workflow.
- Researchers validating whether the interface remains observation-only.

## Core Experience Principles

1. **Human-first language**  
   The Chinese interface must use ordinary teacher/caregiver wording. It should explain what happened, what to look at, and what to try next.

2. **Premium first impression**  
   The first screen should feel like a designed product: immersive visual header, glass navigation, refined cards, strong hierarchy, and confident spacing.

3. **Scores must be readable without training**  
   A user should understand what `4/5` means without reading a methodology document. Each rubric needs a score, status, plain explanation, and visual cue.

4. **Observation-only safety**  
   The product must never imply diagnosis, treatment efficacy, medical improvement, or automated professional judgment.

5. **Useful before beautiful**  
   Visual polish must help comprehension. Large charts and animations should clarify the child's observation profile, not become decoration.

## Non-Goals

- Do not add backend integration.
- Do not add real authentication.
- Do not add medical, therapeutic, or diagnostic claims.
- Do not build a marketing landing page.
- Do not introduce a heavy 3D scene, particle system, or expensive animation layer.
- Do not migrate away from React, Vite, Tailwind, Recharts, Zustand, or Vitest in this iteration.
- Do not remove English support; the Chinese copy is the priority, but the language toggle must still work.

## Terminology Rules

### Chinese UI Forbidden Terms

The Chinese visible interface must not show these terms:

- `Session`
- `Motion`
- `Affect`
- `seed`
- `confidence`
- `dimension`
- `rubric`
- `matrix`
- `trace`
- `claim`
- `AI 自动判断`
- `诊断`
- `疗效`
- `康复有效`
- `恢复正常`

### Chinese Replacements

| Internal term | Chinese UI replacement |
|---|---|
| Session | 第 N 次活动 |
| Session timeline | 活动记录 |
| Motion-Affect | 动作和状态变化 |
| seed | 创作片段 |
| confidence | 证据充分度 |
| evidence | 观察依据 |
| dimension / rubric | 观察问题 |
| matrix | 关系图 |
| insight | 观察发现 |
| trend | 最近变化 |
| teacher review | 老师复核 |

### Copy Tone

Chinese copy should sound like a teacher-facing product:

- Use: `孩子在哪些环节更愿意参与`
- Avoid: `活动参与维度表现较好`
- Use: `不舒服后，通常能在老师轻提示下回到活动`
- Avoid: `恢复节律指标出现改善`

## Information Architecture

The app keeps four main sections but renames the Chinese labels:

| Current route | Chinese label | Purpose |
|---|---|---|
| Overview | 总览 | Premium observation dashboard and 9-score overview |
| Session Timeline | 活动记录 | Story-style review of each activity |
| Motion-Affect | 状态变化 | Which music, visual, and support settings fit the child |
| Report Review | 报告审核 | Teacher approval and family-facing summary |

English labels may remain closer to current product language, but must not break layout.

## Visual Direction

### Overall Style

Use a high-end calm product aesthetic:

- Light, airy interface.
- Large immersive first screen.
- Soft glass panels.
- 8px card radius by default, with larger radius allowed only for the hero search/control surface and score ring container.
- Restrained shadows.
- Warm off-white surface.
- Multi-hue palette: deep teal, coral, soft sky, sage, warm ivory. Avoid a one-note blue/purple dashboard.

### Background Treatment

The overview page should open with an immersive hero band inspired by the user-provided reference image:

- Full-width top visual area.
- Use a generated/static visual asset or CSS-backed atmospheric image treatment related to music, soft light, sound waves, classroom calm, or nature.
- The visual should fade into the white dashboard surface.
- Hero text is over the visual, not inside a card.
- The child name and observation context must be visible in the first viewport.

The hero must not use:

- Commercial affiliate or revenue imagery.
- Generic business analytics language.
- Dark blurred stock background that makes the product hard to read.

### Layout

Overview desktop layout:

1. Hero/navigation band.
2. Floating search/control row.
3. Four high-signal summary cards.
4. Two-column main dashboard:
   - Left: priority findings and score cards.
   - Right: large 9-rubric visualization.
5. Lower section:
   - Recent changes.
   - Teacher review focus.
   - Next activity suggestions.

Mobile layout:

1. Hero.
2. Compact child switcher and language toggle.
3. Summary cards in a 2-column grid.
4. Score visualization first.
5. Score cards stacked.
6. Activity and report summaries stacked.

## Data Presentation

### Summary Cards

Replace current metric cards with four teacher-readable cards:

1. `活动记录`  
   Value: `8 次`  
   Caption: `已形成小宇自己的观察基线`

2. `创作片段`  
   Value: `20 个`  
   Caption: `动作、哼唱和互动留下的可用片段`

3. `最近状态`  
   Value: `投入`  
   Caption: `最近一次活动中更多出现`

4. `老师复核`  
   Value: `陈老师`  
   Caption: `报告导出前由老师确认`

Each card should include a small visual sparkline, icon, or state marker. Do not show raw internal codes.

### 9 Rubric Visualization

Add a new central visualization named `9 项观察总览`.

Recommended display: segmented radial score ring.

Requirements:

- 9 segments, one per observation question.
- Each segment represents a score from 1 to 5.
- Use color and length/opacity to encode score.
- Center label shows a plain summary, for example:
  - `整体观察`
  - `较稳定`
  - `仍有 3 项需要老师支持`
- Hover/focus state reveals:
  - rubric title
  - `4/5`
  - status label
  - one plain explanation
- Keyboard focus must access the same information.

If radial rendering becomes unreliable, fallback to a premium heatmap grid:

- 3 by 3 layout.
- Each cell shows title, score, state, and a small progress bar.
- The fallback must still feel intentionally designed, not like a plain table.

### Rubric Score Cards

Each rubric card should show:

- Observation question title.
- Score as `4/5`.
- Plain status label.
- One sentence explanation.
- One primary observable behavior.
- Small progress visualization.
- Optional expand action for score anchors.

Status labels:

| Score | Chinese status |
|---:|---|
| 1 | 暂时困难 |
| 2 | 需要较多支持 |
| 3 | 需要一点支持 |
| 4 | 比较稳定 |
| 5 | 很稳定 |

Score card examples:

- `愿不愿意参与`  
  `4/5 · 比较稳定`  
  `多数时候能进入活动，偶尔需要老师轻提示。`  
  `主要看：能不能主动开始或继续活动`

- `不舒服后能不能回来`  
  `3/5 · 需要一点支持`  
  `降低亮度或放慢节奏后，更容易回到活动。`  
  `主要看：暂停后能不能回到活动`

### Review Focus Panel

Add a high-signal panel named `今天先看这 3 件事`.

It should show:

1. `参与和表达更稳定`  
   `熟悉旋律和慢节奏时，小宇更愿意参与。`

2. `高亮动画需要复核`  
   `第 6 次活动后出现退出，建议默认降低亮度。`

3. `下一次活动建议`  
   `从低亮度、慢节奏和熟悉旋律开始。`

Each item should include a clear state marker:

- `已确认`
- `待复核`
- `下次尝试`

## Page-Specific Design

### Overview Page

The overview page is the premium product front door.

Required visible sections:

1. Immersive hero.
2. Glass navigation.
3. Search/control pill.
4. Summary cards.
5. 9-rubric score ring.
6. Rubric score cards.
7. Review focus panel.
8. Recent observation findings.

The page must still work with three children: 小宇, 乐乐, 安安.

### Activity Records Page

Rename from `Session 时间轴` to `活动记录`.

Replace `Session N` labels with `第 N 次活动`.

Use story-card format:

- Date.
- Activity number.
- Plain state label.
- What happened.
- What helped.
- What needs review.

Example:

`第 6 次活动`

`高亮动画后，小宇短暂停下并退出活动。老师降低亮度后，下一次活动更容易回到共创流程。`

### State Changes Page

Rename from `动作-情绪关联` to `状态变化`.

Main title:

`什么设置更适合孩子`

Sections:

1. `音乐和节奏`
2. `画面亮度`
3. `老师支持方式`

Avoid showing technical matrix language. Charts should answer a practical question:

- Which settings help participation?
- Which settings increase load?
- What should be kept next time?

### Report Review Page

Keep teacher approval workflow.

Improve headings:

- `专业观察版` can remain if used for teacher-side copy.
- Parent-facing section should use `给家长看的摘要`.
- `老师审核单向阀` should be replaced with `老师确认后再导出`.

## Component Plan

New components:

- `src/components/overview/ImmersiveHero.tsx`
  - Owns hero visual, headline, subtitle, child switcher placement hook, and search/control pill.

- `src/components/overview/ObservationScoreRing.tsx`
  - Shows 9-segment score visualization.
  - Receives display-ready rubric data.
  - Provides hover and keyboard labels.

- `src/components/overview/ObservationScoreCard.tsx`
  - Shows a single rubric score with progress bar, status, and primary observable behavior.

- `src/components/overview/ReviewFocusPanel.tsx`
  - Shows the three review priorities.

- `src/components/state/SettingFitPanel.tsx`
  - Replaces the technical motion-affect matrix with practical setting-fit sections for music/tempo, visual brightness, and teacher support.

- `src/lib/displayRubrics.ts`
  - Converts raw `EvaluationDimension` objects into UI-friendly display data:
    - `scoreLabel`
    - `statusLabel`
    - `plainExplanation`
    - `primaryObservable`
    - `tone`
    - `sourceLabel`

Updated components:

- `src/components/layout/AppShell.tsx`
  - Update Chinese navigation labels.
  - Keep layout responsive.

- `src/pages/OverviewPage.tsx`
  - Use new components.
  - Remove dense rubric card rendering from page body.

- `src/pages/SessionTimelinePage.tsx`
  - Rename and restructure visible copy.

- `src/components/session/SessionTimeline.tsx`
  - Replace `Session` labels and compact technical counters.

- `src/pages/MotionAffectPage.tsx`
  - Rename and restructure around practical settings.

- `src/components/charts/MotionAffectMatrix.tsx`
  - Remove from the Chinese state-change page and replace with `SettingFitPanel`.
  - Keep the file only if English or test compatibility still imports it; otherwise delete it during implementation.

- `src/components/report/TeacherReviewPanel.tsx`
  - Replace `老师审核单向阀` copy.

## Data Model Additions

Current `EvaluationDimension` can remain as the source model.

Add derived display data instead of changing backend-like data:

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
};
```

`sourceLabel` should use readable activity references:

- Good: `来自第 2、4、5、8 次活动`
- Bad: `session-2 / session-4 / session-5 / session-8`

## Interaction Design

### Search/Control Pill

The hero search pill is functional in this iteration.

Placeholder:

`搜索活动、观察问题或老师备注`

Behavior:

- It filters rubric score cards and recent observation findings client-side.
- Empty search shows all cards and findings.
- No-result state shows: `没有找到相关观察记录，可以换个关键词试试。`
- It must not open external search.

### Score Ring Interactions

Desktop:

- Hover a segment to highlight matching score card.
- Focus a segment with keyboard to show the same tooltip.

Mobile:

- Tap a segment to show details below the ring.
- No hover-only information.

### Reduced Motion

All animations must respect `prefers-reduced-motion`.

Allowed animations:

- Fade in.
- Slight translate.
- Soft card hover.
- Score ring draw-once animation.

Avoid:

- Infinite decorative motion.
- Large parallax.
- Heavy canvas.
- Scroll-jacking.

## Accessibility

Required:

- Score ring must have readable labels for screen readers.
- Score cards must not rely only on color.
- Contrast must be readable on hero background.
- Hero text must sit on a gradient overlay if needed.
- Navigation must remain keyboard reachable.
- Mobile layout must avoid text overlap.

## Performance Budget

Targets:

- No new heavy visualization library.
- Reuse Recharts only where it already exists.
- Prefer CSS/SVG for the score ring.
- Avoid remote image dependencies for the core page.
- Generated/static asset should be local and optimized.
- Build should remain successful with the existing Vite pipeline.

The current bundle already triggers a Vite chunk warning. This redesign must not add another large dependency unless explicitly approved.

## Testing Plan

Update or add tests for:

1. Chinese UI forbidden terms do not appear on core pages:
   - `Session`
   - `Motion`
   - `Affect`
   - `seed`
   - `confidence`
   - `dimension`

2. Overview page shows premium dashboard sections:
   - `小宇的共创观察`
   - `9 项观察总览`
   - `今天先看这 3 件事`
   - at least one rubric card with `4/5 · 比较稳定`

3. Activity records use user-friendly labels:
   - `第 6 次活动`
   - no visible `Session 6`

4. State changes page answers practical questions:
   - `什么设置更适合孩子`
   - `音乐和节奏`
   - `画面亮度`
   - `老师支持方式`

5. Report review copy uses user-friendly wording:
   - `老师确认后再导出`
   - no visible `老师审核单向阀`

6. Existing safety tests still pass:
   - no diagnosis or treatment-effect terms.

Verification commands:

```bash
npm test -- --run
npm run build
```

## Acceptance Criteria

The redesign is accepted when:

- The Chinese app no longer feels like a demo dashboard.
- First viewport has a high-end, immersive product impression.
- A non-technical user can understand the 9 scores without reading documentation.
- Every rubric score has a visible score, status, explanation, and observable behavior.
- Chinese pages do not expose internal engineering terms.
- Activity records use `第 N 次活动`, not `Session N`.
- State charts answer practical teacher/caregiver questions.
- Tests pass.
- Build passes.
- No moderate-or-higher npm audit vulnerabilities are introduced.

## Visual Asset Decision

Implementation should use this direction:

- Soft abstract sound-wave background.

Reason: it avoids stock-photo mismatch and keeps the product calm, premium, and domain-relevant. A warm music room or nature-light background is outside this iteration.
