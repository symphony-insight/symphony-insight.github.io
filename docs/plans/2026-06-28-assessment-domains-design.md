# 用 6 维科学框架重组 9 项观察（设计文档）

## 背景与定位
产品保持「音乐共创活动里的老师观察工具」定位，**不做诊断、不替代专业判断、不和别的孩子比**。
本次只是借鉴 ASD 评估常用的 6 维科学框架，作为现有 9 项观察的**分组/标签结构**，让科学骨架显性化，提升可信度——不新增观察项、不改 9 项数据、不引入 IQ 测试。

## 6 维模型与映射（已确认）
| 维度 | 科学名 | 覆盖的观察项 |
|---|---|---|
| 社会交往 | Social Communication | respond（回应别人）、choice（说出选择，含发起互动） |
| 表达沟通 | Communication（非语言为主） | create（自己的表达） |
| 专注与学习 | Attention & Learning（认知，**刻意不提 IQ**） | focus（保持兴趣）、goal（小目标进展，自比） |
| 适应与参与 | Adaptive Participation | join（愿意参加）、recover（不舒服后回来）、access（操作顺手） |
| 感觉与环境 | Sensory & Environment | setting（环境舒适） |
| 行为模式 | Behavior Patterns (RRB) | **空——本产品不单独观察**（诚实留白，说明原因：属诊断轴，需专业评估） |

命名取舍：
- "认知" → **"专注与学习"**：明确不等于 IQ，守住边界。
- "语言" → **"表达沟通"**：音乐场景用非语言表达承接，更贴合产品。
- 第 6 维 RRB 作为诚实留白，反而增强可信度（清楚完整框架、也清楚只覆盖了哪部分）。

## 实现（纯展示层，不动数据）

### 1. 新增 `src/lib/assessmentDomains.ts`
```ts
export type AssessmentDomain = {
  id: "social" | "communication" | "attention" | "adaptive" | "sensory" | "behavior";
  nameZh: string; nameEn: string;        // 社会交往 / Social Communication
  plainZh: string;                        // 给家长的更白的名
  rubricIds: EvaluationDimension["id"][]; // 空数组=未覆盖
  noteZh: string; noteEn: string;         // 这个维度在本产品里看什么/为什么
  covered: boolean;
};
export const assessmentDomains: AssessmentDomain[];
export function getDomainForRubric(id): AssessmentDomain | undefined;
```

### 2. 评分说明页 `RubricGuidePage.tsx`：按 6 维分区
- "9 项分别在看什么" 区块从平铺改为**按 6 维分组**：每组一个小标题（维度名 + plain 名 + note），下面是该组的 rubric 卡。
- 第 6 维 RRB 单独呈现为"未单独观察"的说明卡（中性、非诊断措辞）。
- 顶部"我们参考了哪些方向"补一句：观察项按社会交往/表达/专注/适应/感觉等维度组织。

### 3. 总览页 RubricChip / 雷达图：加维度标签
- `RubricChip` 展开区已有"参照 framework"，再加一行**所属维度**（如"社会交往"）小标签。
- 雷达图可选：按维度给轴上色或分组（本轮先不做，避免过度，留待确认）。

### 4. i18n
- 新增 6 维名称、plain 名、note 的中英文（或直接放进 assessmentDomains.ts 内联，减少 i18n 噪音）。

## 安全与边界
- 不出现：诊断、疗效、IQ、自动判断等禁用词。
- RRB 维度文案中性：只说"属于需要专业评估的方向，本工具不单独观察"。
- 不改 9 项 `EvaluationDimension` 数据与分数。

## 测试与验证
- 不破坏既有断言文案（4/5、比较稳、愿不愿意参加、关键变化、操作方式顺不顺手等）。
- 新增 `assessmentDomains.test.ts`：验证 9 项全部映射到某维度、RRB covered=false、无重复/遗漏。
- `npm test -- --run` / `npm run build` / `npm audit --audit-level=moderate` 全绿。
- 截图核对评分说明页分组与总览维度标签。

## 范围约束
- 纯前端展示层，不接后端、不加依赖、不动数据层。
- 保留暖白玻璃质感与现有布局。
