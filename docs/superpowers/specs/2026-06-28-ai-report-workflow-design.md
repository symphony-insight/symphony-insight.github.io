# 报告生成与老师复核前端设计规格

## 1. 目标

在现有 SymPhony Insight 前端上，补齐 proposal 中“结构化观察 → AI 草稿 → 表述检查 → 老师复核 → 家长摘要”的产品链路。

本轮仍然先做前端，不接真实后端，不接真实 LLM API。前端需要用 mock 数据模拟一条可信的报告生成链路，让老师看起来像在使用一套正式复核工作台，也让评委能看懂后端会有 AI 网关和 LLM Report Service。

核心目标：

1. 活动报告页从“展示静态报告”升级为“老师复核工作流”。
2. 新增“报告怎么来的”说明页，解释报告数据来源、AI 作用和边界。
3. 保持当前 premium dashboard 的视觉系统、路由结构、状态管理和 mock API，不重建页面框架。
4. 中文界面保持老师和家长能理解的自然表达，不出现工程后台词。

## 2. 设计范围

本轮修改当前前端中的这些区域：

- `src/pages/ReportReviewPage.tsx`
- `src/components/report/ReportDraftPanel.tsx`
- `src/components/report/TeacherReviewPanel.tsx`
- `src/app/routes.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/api/mockApi.ts`
- `src/data/mockData.ts`
- `src/types/domain.ts`
- `src/i18n.ts`
- 新增 `src/pages/ReportMethodPage.tsx`
- 可新增少量报告相关组件，放在 `src/components/report/`

本轮不做：

- 真实后端 API 接入。
- 真实 LLM API 调用。
- 真实账号、权限、登录。
- 原始音视频上传。
- 诊断、治疗建议、疗效判断。
- 新增单独的工程控制台。
- 重做首页、评分说明页或整体视觉系统。
- 引入重型动画库或新设计系统。

当前评分说明页已经承担“分数 ↔ 行为 ↔ 数据 ↔ 文献”的完整解释职责。本轮报告工作流只需要链接和引用这条证据链，不在报告页重新制作阈值表、 DOI 列表或文献卡片。

## 3. 用户与使用场景

### 3.1 特教老师

老师需要看懂系统整理出的报告草稿，确认哪些内容可以给家长，哪些内容要改。老师关注：

- 报告来自哪些活动记录。
- 草稿有没有不适合直接给家长看的表述。
- 哪些地方需要自己补充或修改。
- 确认前是否会自动导出。

### 3.2 家长或监护人

家长最终只看到老师确认后的简明摘要。前端需要让老师明确知道：家长版不是自动生成后直接发送，而是经过老师确认后的表达。

### 3.3 机构管理者与项目评委

他们需要看懂系统不是静态 mock，而是为后端的 AI 网关、报告草稿服务、合规检查和审计链路预留了清晰入口。

## 4. 设计原则

### 4.1 老师工作流优先

主页面不能像模型演示页。用户首先看到的是：

```text
系统先整理草稿
老师看过后再导出
不合适表述会被标出
所有内容来自活动记录和观察问题
```

### 4.2 技术解释放到说明页

技术细节不能挤进活动报告主流程。需要解释 AI 网关、生成版本、mock 服务、真实模型服务时，放到“报告怎么来的”页面的折叠说明里。

### 4.3 AI 不参与评分

前端必须表达清楚：

- 9 项观察问题的评分来自结构化活动记录。
- 每项分数的阈值表、当前档位、定量依据和支撑文献，以现有“评分说明”页为准。
- AI 只负责把结构化记录整理成草稿。
- AI 不决定孩子情况。
- AI 不生成医学判断。

### 4.4 保持现有产品气质

继续使用当前的：

- warm paper 背景。
- card 组件。
- display 字体。
- coral / tide / sage 等强调色。
- `page-enter` 动效。
- sidebar 信息架构。

不做新的视觉主题，不把页面改成灰色后台或开发者控制台。

## 5. 页面结构

## 5.1 活动报告页

路径保持：

```text
#/child/:childId/report
```

页面目标：让老师完成报告复核。

页面从上到下分为 5 个区域：

1. 顶部标题区。
2. 报告流程条。
3. 草稿来源卡。
4. 报告双栏内容。
5. 老师确认与操作记录。

### 顶部标题区

现有标题保留，但文案调整为更明确的工作流表达：

```text
活动报告
系统先整理草稿，老师确认后才会给家长。
```

英文保留工作台口吻：

```text
Report Review
The system prepares an editable draft. Teachers review it before parent export.
```

### 报告流程条

新增一个横向流程条，桌面端横向，移动端纵向。

四步：

| 步骤 | 中文标题 | 说明 |
|---|---|---|
| draft | 整理草稿 | 来自活动记录和观察问题 |
| safety | 检查表述 | 标出不适合直接使用的话 |
| review | 老师确认 | 老师可以修改、退回或通过 |
| export | 导出摘要 | 通过后才能给家长 |

状态规则：

- `draft`：报告刚整理好，第一步高亮。
- `teacher_reviewing`：前三步可显示已完成，第三步高亮。
- `approved`：前三步完成，第四步可用。
- `exported`：四步完成。
- `rejected`：第三步显示“需要修改”，第四步不可用。
- `blocked`：第二步显示“暂时不能导出”，第三、四步不可用。

用户可见文案不出现：

- `LLM`
- `API`
- `provider`
- `prompt`
- `payload`
- `model id`

### 草稿来源卡

新增一组小卡片，放在流程条下方。

默认展示：

```text
8 次活动记录
9 项观察问题
6 个观察方向
老师备注
```

说明文案：

```text
这份草稿来自活动里的记录和老师可复核的评分，不会自动判断孩子情况。
```

卡片定位是“来源说明”，不是 KPI。数字样式可以和现有总览卡保持一致，但要降低竞技感。

`9 项观察问题` 卡片需要提供跳转入口：

```text
查看评分说明
```

点击后进入现有页面：

```text
#/child/:childId/rubrics
```

这里不重复展示每项 1-5 分阈值表，也不重复列出 Kim 2008、Geretsegger 2022、Billing 2020、Baxter 2007 等文献。报告页只说明“报告草稿引用了评分说明页中的可追溯评分结果”。

### 报告双栏内容

复用 `ReportDraftPanel` 的双栏结构：

- 左侧：`老师看的详细版`
- 右侧：`给家长看的摘要`

增强点：

1. 左侧增加 `草稿` 标签，提醒它还可以改。
2. 右侧增加 `老师确认后可导出` 提示。
3. 如果表述检查为 `needs_edit`，在对应句子上方显示温和提示。
4. 如果表述检查为 `blocked`，右侧家长摘要不展示正文，只显示：

```text
这版草稿里有不适合直接给家长看的表述，需要老师修改后再导出。
```

### 老师确认与操作记录

复用 `TeacherReviewPanel`，但职责更清楚：

顶部显示：

```text
老师看过后再导出
报告不会自动发给家长。老师看过后，才能导出摘要。
```

新增“表述检查”区域：

通过时：

```text
没有发现不适合直接使用的表述。
```

需要修改时：

```text
有几句话建议老师改一下。
```

阻断时：

```text
这版草稿暂时不能导出，请先修改标出的表述。
```

操作按钮保持现有逻辑：

- `继续修改`
- `退回修改`
- `确认通过`
- `导出给家长`

新增按钮：

- `重新整理草稿`

点击后 mock API 模拟生成流程：

1. 按钮进入 loading。
2. 流程条第一步显示轻微 loading 状态。
3. 600-900ms 后更新报告草稿。
4. 操作记录新增：

```text
系统整理了一版报告草稿，等老师确认。
```

## 5.2 报告怎么来的页面

新增路径：

```text
#/child/:childId/report-method
```

导航名称：

```text
报告怎么来的
```

英文：

```text
How Reports Work
```

页面目标：解释系统如何从活动记录生成报告草稿，以及 AI 做什么、不做什么。

页面结构：

1. 一句话说明。
2. 五步流程图。
3. AI 做什么。
4. AI 不做什么。
5. 这份报告用了哪些资料。
6. 更详细的系统说明。

### 一句话说明

```text
系统只整理活动记录，最后怎么看、怎么发，仍然由老师决定。
```

### 五步流程图

五步：

```text
活动中留下记录
整理成观察指标
生成报告草稿
检查不合适表述
老师确认后导出
```

视觉：

- 桌面端横向。
- 移动端纵向。
- 使用轻微 stagger fade-in。
- 不使用 canvas、粒子、复杂滚动动画。

### AI 做什么

三张卡：

```text
把结构化记录写成草稿
把专业表述改得更容易读
检查有没有不该直接使用的话
```

### AI 不做什么

五张卡：

```text
不诊断
不判断病情变好或变坏
不自动给家长发送
不替代老师判断
不读取原始音视频
```

这一区域要醒目但克制，不使用警报式红色大面积背景。

### 这份报告用了哪些资料

展示当前孩子的报告来源：

```text
活动次数
观察问题
评分依据
老师备注
生成记录
审核记录
```

这里可以使用和草稿来源卡一致的视觉语言。

其中 `评分依据` 必须链接到现有“评分说明”页。说明页已经展示：

- 每张观察问题卡右上角的分数 chip。
- `1–5 分分别代表什么` 阈值表。
- 当前档位高亮和 `本轮在这一档` 标注。
- `为什么是这个分` 的真实活动定量依据。
- 每个观察方向顶部的支撑文献 chip。
- 底部完整参考文献与边界声明。

“报告怎么来的”页面只做摘要和入口，不再复制完整引用列表，避免两处内容不一致。

### 更详细的系统说明

默认收起。展开后才出现技术词。

内容：

```text
AI 网关统一管理报告草稿服务。
密钥只在后端保存，前端不会直接调用模型。
生成结果会保存版本、检查结果和操作记录。
当前前端使用 mock 服务模拟生成过程。
后端接入真实模型服务时，页面结构不需要重做。
9 项观察问题的评分不会调用 AI。
```

这个折叠区服务评委和技术沟通，不服务日常老师操作。

## 6. 数据结构

在 `src/types/domain.ts` 中增量扩展现有 `ReportDraft`。

新增类型：

```ts
export type ReportGenerationStatus =
  | "not_started"
  | "generating"
  | "draft_ready"
  | "needs_teacher_review"
  | "approved"
  | "exported"
  | "blocked";

export type ReportSafetyDisplayStatus = "passed" | "needs_edit" | "blocked";
```

扩展 `ReportDraft`：

```ts
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

字段展示规则：

- `modelLabel` 中文显示为 `报告整理助手`。
- `promptVersion` 只放在折叠技术说明或细节小字里。
- `flaggedPhrases` 只在老师复核区展示，不进入家长摘要。
- `evidenceTrace` 用于来源卡和未来后端接口，不在主页面直接暴露 ID。
- `referenceIds` 对应 `src/lib/references.ts` 中已经核实的文献记录，用于说明页链接，不用于报告正文生成。

## 7. Mock API

在 `src/api/mockApi.ts` 增加：

```ts
generateReportDraft(childId: string): Promise<ReportDraft>
```

行为：

1. 找到当前孩子的报告。
2. 将报告 generation status 更新为 `generating`。
3. 延迟 600-900ms。
4. 返回更新后的 `draft_ready` 报告。
5. 更新 `generatedAt`。
6. 新增 audit log：

```text
系统整理了一版报告草稿，等老师确认。
```

错误：

- 未知孩子抛出 `Unknown child: ${childId}`。
- 被拦截草稿可用 mock 数据模拟，但默认小宇报告为 `passed`。

## 8. 组件拆分

优先复用现有组件。新增组件只放在报告模块里。

建议新增：

- `src/components/report/ReportWorkflowSteps.tsx`
  - 展示四步流程条。
  - 输入 `report: ReportDraft`。

- `src/components/report/ReportSourceSummary.tsx`
  - 展示活动、观察问题、观察方向、老师备注来源。
  - 输入 `report: ReportDraft`。

- `src/components/report/ReportSafetyNotice.tsx`
  - 展示表述检查状态。
  - 输入 `report.safetyCheck`。

- `src/components/report/ReportMethodFlow.tsx`
  - 供新增说明页使用。

修改：

- `ReportReviewPage`
  - 加入生成草稿按钮与生成状态。
  - 组合 workflow、source、review、draft panel。

- `ReportDraftPanel`
  - 增加草稿标签、家长版导出提示和 blocked 状态。

- `TeacherReviewPanel`
  - 增加表述检查、重新整理草稿按钮、生成中状态。

## 9. 文案规范

中文主流程推荐词：

| 内部含义 | 中文可见表达 |
|---|---|
| AI generated draft | 系统整理的草稿 |
| LLM report service | 报告整理助手 |
| safety check | 表述检查 |
| prompt version | 生成版本 |
| provider | 服务来源 |
| generated output | 草稿内容 |
| blocked | 暂时不能导出 |
| audit log | 操作记录 |

中文主流程禁用词：

- `LLM`
- `API`
- `provider`
- `prompt`
- `payload`
- `model id`
- `自动判断`
- `诊断`
- `疗效`
- `康复有效`
- `恢复正常`
- `病情好转`
- `自闭症减轻`
- `脑瘫好转`

这些技术词只允许在“更详细的系统说明”折叠区出现：

- `AI 网关`
- `mock 服务`
- `真实模型服务`
- `生成版本`
- `后端密钥`

## 10. 动效与性能

允许：

- `opacity`。
- `transform`。
- `box-shadow`。
- CSS transition。
- 已有 `page-enter`。
- 轻微 stagger fade-in。
- 按钮 loading 状态。
- 流程条轻微 shimmer。

禁止：

- 新增重型动画库。
- canvas 粒子。
- 实时滚动监听动画。
- 首屏依赖动画完成后才显示内容。
- 大面积 blur 动画。
- 复杂布局动画导致移动端抖动。

性能要求：

- 生成草稿的 loading 只是 mock 延迟，不阻塞页面其他操作。
- 移动端流程条必须纵向排列，不能横向溢出。
- 报告双栏在窄屏变单栏。
- 按钮文本不能溢出。
- 新增页面不使用远程图片。

## 11. 中英文支持

所有新增可见文案必须进入 `src/i18n.ts`，或者在组件中使用清晰的双语映射。

新增中文 key 建议：

- `reportMethod`
- `reportMethodTitle`
- `reportMethodIntro`
- `reportWorkflowDraft`
- `reportWorkflowSafety`
- `reportWorkflowReview`
- `reportWorkflowExport`
- `regenerateDraft`
- `draftSourceTitle`
- `safetyPassed`
- `safetyNeedsEdit`
- `safetyBlocked`

英文保持专业但不生硬：

- `System-prepared draft`
- `Expression check`
- `Teacher review`
- `Parent export`
- `How reports work`

## 12. 测试

### 12.1 Mock API 测试

更新 `src/api/mockApi.test.ts`：

- `generateReportDraft(childId)` 返回报告。
- 生成后 report generation status 为 `draft_ready`。
- 生成后 audit log 增加一条系统整理草稿记录。
- 未知 childId 抛出错误。

### 12.2 页面测试

更新 `src/pages/pages.test.tsx`：

- 活动报告页能显示四步流程。
- 活动报告页能显示草稿来源。
- 活动报告页能从 `9 项观察问题` 来源卡跳到评分说明页。
- 活动报告页能显示表述检查结果。
- 活动报告页有 `重新整理草稿` 操作。
- `报告怎么来的` 页面可渲染，并能链接到评分说明页。

### 12.3 Smoke 测试

更新 `src/test/smoke.test.ts`：

- 所有主要路由可渲染。
- 中英文切换后报告页不空白。
- 新增 `report-method` 路由不空白。

### 12.4 构建验证

执行：

```bash
npm test
npm run build
```

都必须通过。

## 13. 手动验收

在 `http://localhost:5173/` 检查：

### 活动报告页

路径：

```text
#/child/xiaoyu/report
```

必须满足：

- 能看到 `整理草稿 → 检查表述 → 老师确认 → 导出摘要`。
- 能看到 `8 次活动记录 / 9 项观察问题 / 6 个观察方向 / 老师备注`。
- 点击 `查看评分说明` 能进入现有评分说明页。
- 能看到表述检查状态。
- 点击 `重新整理草稿` 有 loading 和完成状态。
- 老师未确认前，`导出给家长` 不可用。
- 确认通过后，`导出给家长` 可用。
- 页面不出现 `LLM / API / provider / prompt / payload`。

### 报告怎么来的页面

路径：

```text
#/child/xiaoyu/report-method
```

必须满足：

- 能看懂报告从哪里来。
- 能理解评分依据来自现有评分说明页，而不是报告页重新解释。
- 能区分 AI 会做什么和不会做什么。
- 默认不展示技术细节。
- 展开后才显示 AI 网关和 mock 服务说明。
- 不出现诊断或疗效暗示。
- 不重复展示完整 DOI 文献列表，只提供到评分说明页的入口。

### 移动端

必须满足：

- 流程条纵向排列。
- 报告双栏变单栏。
- 按钮不挤压。
- 文本不溢出。

## 14. 成功标准

这次前端更新成功的标准不是“看起来很 AI”，而是用户能理解：

1. 这份报告不是系统自动发给家长的。
2. 草稿来自可追溯的活动记录和观察问题。
3. AI 只是把结构化记录整理成可读草稿。
4. 老师仍然是最终确认的人。
5. 评分和观察依据不依赖 AI 随口生成。
6. 用户能从报告页进入评分说明页，看到分数、行为、数据和文献依据。
7. 技术上已经为后端 AI 网关和 LLM Report Service 预留了自然接口。

## 15. 与后端计划的关系

本设计对应后端计划中的：

- AI Gateway With Mock Provider。
- Generate LLM Report Drafts From Structured Observations。
- Teacher Review And Export Gate。
- Frontend Through A Switchable API Adapter。

前端先使用 `mockApi.generateReportDraft()` 模拟后端行为。后端完成后，同一个前端交互可以切换到真实接口：

```text
POST /api/v1/children/{child_id}/reports/draft
GET /api/v1/children/{child_id}/reports/current
PATCH /api/v1/reports/{report_id}/status
POST /api/v1/reports/{report_id}/export-parent-summary
```

真实 LLM API 仍然不由前端直接调用。
