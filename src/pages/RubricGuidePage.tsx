import { CheckCircle2, Compass, Gauge, ListChecks, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";
import { Card } from "../components/ui/Card";
import { getFrameworkLabel, getMetricLabels } from "../lib/rubricEvidence";
import { useAppStore } from "../store/useAppStore";
import type { EvaluationDimension } from "../types/domain";

const scaleLevels = [
  { score: "1", label: "暂时还难", tone: "bg-coral", desc: "很少出现，或孩子明显不舒服。" },
  { score: "2", label: "需要多一点帮助", tone: "bg-coral/70", desc: "需要较多提示或陪伴才能做到一点。" },
  { score: "3", label: "需要一点提醒", tone: "bg-sun", desc: "有人轻轻提醒时，能做到一部分。" },
  { score: "4", label: "比较稳", tone: "bg-tide", desc: "多数时候能做到，偶尔需要轻提示。" },
  { score: "5", label: "很稳", tone: "bg-moss", desc: "能主动做到，换个活动也能继续用。" }
];

const principles = [
  {
    icon: Compass,
    title: "只看观察，不下结论",
    body: "9 项问题描述的是孩子在活动里做了什么，帮老师决定下次怎么支持，而不是给孩子贴标签或下判断。"
  },
  {
    icon: ListChecks,
    title: "每项都来自可记录的行为",
    body: "分数不是凭感觉打的，而是把每次活动里记录到的动作、参与、回应、恢复等信号整理出来。"
  },
  {
    icon: CheckCircle2,
    title: "只和孩子自己比",
    body: "参考目标达成（GAS）的思路：先为孩子定下自己的小目标，再看有没有往前走，不和别的孩子比。"
  }
];

const references = [
  {
    title: "Kim, Wigram & Gold (2008)",
    detail: "即兴音乐治疗中的共同注意行为随机对照研究，用视频编码眼神、轮流等行为。",
    supports: "回应别人、愿不愿意参加、自己的表达"
  },
  {
    title: "Geretsegger et al. (2022, Cochrane 综述)",
    detail: "纳入 26 项研究、1165 名参与者；同时提醒社交与沟通方面的证据确定性仍然有限。",
    supports: "提醒我们：只呈现观察材料，不谈疗效或诊断"
  },
  {
    title: "Goal Attainment Scaling（Kiresuk & Sherman, 1968）",
    detail: "为个体目标定义可测量的等级，只与自身目标比较。",
    supports: "这周小目标有没有往前走"
  },
  {
    title: "行为/参与多模态研究（如 DREAM、DAiSEE 数据集）",
    detail: "提供身体动作、注视、参与度等可量化的行为变量，作为指标设计的参照。",
    supports: "用主动参与、回到活动用时、提示次数等作为证据"
  }
];

export function RubricGuidePage() {
  const [dimensions, setDimensions] = useState<EvaluationDimension[]>([]);
  const { language, selectedChildId } = useAppStore();

  useEffect(() => {
    mockApi.getEvaluationDimensions(selectedChildId).then(setDimensions);
  }, [selectedChildId]);

  return (
    <div className="space-y-6 page-enter">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">评分说明</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tightish md:text-4xl">9 项观察问题是怎么设计的</h1>
        <p className="mt-2 max-w-3xl text-ink-muted">
          这一页讲清楚：每一项在看孩子的什么、看哪些行为、分数怎么定，以及我们参考了哪些方向。给老师做底，也方便和家长解释。
        </p>
      </div>

      {/* 总体原则 */}
      <div className="grid gap-3 stagger md:grid-cols-3">
        {principles.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-tide-50 text-tide-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-3 font-display text-base font-extrabold tracking-tightish">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{item.body}</p>
            </Card>
          );
        })}
      </div>

      {/* 1-5 分量表 */}
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sun-50 text-[#a9802f]">
            <Gauge className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className="font-display text-lg font-extrabold tracking-tightish">1 到 5 分代表什么</h2>
        </div>
        <p className="mt-2 text-sm text-ink-muted">同一把尺子用在 9 项上。分数越高，说明这件事孩子越能自己稳定地做到。</p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
          {scaleLevels.map((level) => (
            <div key={level.score} className="rounded-xl border border-white/70 bg-paper-warm/60 p-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-sm font-extrabold text-white ${level.tone}`}>
                  {level.score}
                </span>
                <span className="text-sm font-bold">{level.label}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-ink-muted">{level.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 9 项逐项 */}
      <div>
        <h2 className="font-display text-xl font-extrabold tracking-tightish">9 项分别在看什么</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {dimensions.map((dimension, index) => {
            const title = language === "zh" ? dimension.title : dimension.titleEn;
            const summary = language === "zh" ? dimension.summary : dimension.summaryEn;
            const criteria = language === "zh" ? dimension.criteria : dimension.criteriaEn;
            return (
              <Card key={dimension.id} className="soft-rise p-5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ink text-sm font-extrabold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-extrabold tracking-tightish">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-ink-soft">{summary}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-white/70 bg-paper-warm/60 p-3">
                  <p className="text-xs font-bold text-ink-muted">主要看这些行为</p>
                  <ul className="mt-2 space-y-1.5">
                    {criteria.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-ink-soft">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tide" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                  <span className="text-ink-muted">
                    用到的记录：
                    <span className="font-semibold text-ink-soft">{getMetricLabels(dimension.id, language).join("、")}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-tide-50 px-2 py-0.5 font-semibold text-tide-600">
                    参照 · {getFrameworkLabel(dimension.id, language)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 参考依据 */}
      <Card className="p-6">
        <h2 className="font-display text-lg font-extrabold tracking-tightish">我们参考了哪些方向</h2>
        <p className="mt-2 text-sm text-ink-muted">
          下面这些研究和方法，只是帮我们决定“该看哪些行为、怎么描述”的设计参照，不是给孩子做评估或诊断的标准。
        </p>
        <div className="mt-4 space-y-2.5">
          {references.map((ref) => (
            <div key={ref.title} className="rounded-xl border border-white/70 bg-white/80 p-4">
              <p className="font-semibold">{ref.title}</p>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{ref.detail}</p>
              <p className="mt-2 text-xs text-ink-muted">
                帮到的项目：<span className="font-medium text-ink-soft">{ref.supports}</span>
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* 边界声明 */}
      <p className="flex items-start gap-2.5 rounded-2xl border border-moss/20 bg-moss-50 p-5 text-moss-600">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="text-sm leading-6 text-ink-soft">
          这些只是给老师看的观察材料，不是给孩子下结论，也不替代老师、治疗师或医生的判断。相关研究也提醒：这类信号能帮我们更懂孩子，但仍要结合现场情况一起看。
        </span>
      </p>
    </div>
  );
}
