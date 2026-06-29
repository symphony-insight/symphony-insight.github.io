import { CheckCircle2, Compass, ExternalLink, Gauge, Layers, ListChecks, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";
import { Card } from "../components/ui/Card";
import { assessmentDomains, getDomainName, getDomainNote } from "../lib/assessmentDomains";
import { getFrameworkLabel, getMetricLabels } from "../lib/rubricEvidence";
import { rubricScaleAnchors } from "../lib/rubricScaleAnchors";
import { getReferencesForDomain, references } from "../lib/references";
import { useAppStore } from "../store/useAppStore";
import type { EvaluationDimension } from "../types/domain";

const scaleLevels = [
  { score: "1", label: "暂时还难", labelEn: "Not yet consistent", tone: "bg-coral", desc: "很少出现，或孩子明显不舒服。", descEn: "Rarely appears, or clearly feels uncomfortable." },
  { score: "2", label: "需要多一点帮助", labelEn: "Needs strong support", tone: "bg-coral/70", desc: "需要较多提示或陪伴才能做到一点。", descEn: "Appears only with substantial prompting or support." },
  { score: "3", label: "需要一点提醒", labelEn: "Needs light support", tone: "bg-sun", desc: "有人轻轻提醒时，能做到一部分。", descEn: "Appears partly when someone gives a light reminder." },
  { score: "4", label: "比较稳", labelEn: "Mostly steady", tone: "bg-tide", desc: "多数时候能做到，偶尔需要轻提示。", descEn: "Appears most of the time, with only occasional prompts." },
  { score: "5", label: "很稳", labelEn: "Independent", tone: "bg-moss", desc: "能主动做到，换个活动也能继续用。", descEn: "Happens independently and carries into another activity." }
];

const principles = [
  {
    icon: Compass,
    title: "只看观察，不下结论",
    titleEn: "Observation, not labels",
    body: "9 项问题描述的是孩子在活动里做了什么，帮老师决定下次怎么支持，而不是给孩子贴标签或下判断。",
    bodyEn: "The guide describes what happened in sessions. It does not label or judge the child."
  },
  {
    icon: ListChecks,
    title: "每项都来自可记录的行为",
    titleEn: "Based on recorded behavior",
    body: "分数不是凭感觉打的，而是把每次活动里记录到的动作、参与、回应、恢复等信号整理出来。",
    bodyEn: "Scores come from recorded actions, responses, returns, and teacher prompts."
  },
  {
    icon: CheckCircle2,
    title: "只和孩子自己比",
    titleEn: "Compared with the child's own goal",
    body: "参考目标达成（GAS）的思路：先为孩子定下自己的小目标，再看有没有往前走，不和别的孩子比。",
    bodyEn: "Progress is compared with this child's own goal, not with other children."
  }
];

const scoreTone: Record<number, string> = {
  1: "bg-coral",
  2: "bg-coral/70",
  3: "bg-sun",
  4: "bg-tide",
  5: "bg-moss"
};

export function RubricGuidePage() {
  const [dimensions, setDimensions] = useState<EvaluationDimension[]>([]);
  const { language, selectedChildId } = useAppStore();

  useEffect(() => {
    mockApi.getEvaluationDimensions(selectedChildId).then(setDimensions);
  }, [selectedChildId]);

  return (
    <div className="space-y-6 page-enter">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">{language === "zh" ? "评分说明" : "Scoring guide"}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tightish md:text-4xl">
          {language === "zh" ? "9 项观察问题是怎么设计的" : "How the scoring guide works"}
        </h1>
        <p className="mt-2 max-w-3xl text-ink-muted">
          {language === "zh"
            ? "这一页讲清楚：每一项在看孩子的什么、看哪些行为、分数怎么定，以及我们参考了哪些方向。给老师做底，也方便和家长解释。"
            : "See what each item looks for, what counts as evidence, and how the 1-5 scale is used."}
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
              <h2 className="mt-3 font-display text-base font-extrabold tracking-tightish">{language === "zh" ? item.title : item.titleEn}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{language === "zh" ? item.body : item.bodyEn}</p>
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
          <h2 className="font-display text-lg font-extrabold tracking-tightish">{language === "zh" ? "1 到 5 分代表什么" : "What scores 1 to 5 mean"}</h2>
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          {language === "zh"
            ? "同一把尺子用在 9 项上。分数越高，说明这件事孩子越能自己稳定地做到。"
            : "The same scale is used across all nine items. Higher scores mean steadier, more independent participation."}
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
          {scaleLevels.map((level) => (
            <div key={level.score} className="rounded-xl border border-white/70 bg-paper-warm/60 p-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-sm font-extrabold text-white ${level.tone}`}>
                  {level.score}
                </span>
                <span className="text-sm font-bold">{language === "zh" ? level.label : level.labelEn}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-ink-muted">{language === "zh" ? level.desc : level.descEn}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 按 6 维分组 */}
      <div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-tide-50 text-tide-600">
            <Layers className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className="font-display text-xl font-extrabold tracking-tightish">{language === "zh" ? "按 6 个观察方向来看" : "Six observation areas"}</h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">
          {language === "zh"
            ? "特殊儿童的观察通常分成几个大方向。我们把 9 项观察按这些方向归好类，方便老师看清楚每一项在看孩子的哪一面。"
            : "The nine items are grouped so teachers can scan the child's participation from several angles."}
        </p>

        <div className="mt-5 space-y-5">
          {assessmentDomains.map((domain) => {
            const rubrics = domain.rubricIds
              .map((id) => dimensions.find((dimension) => dimension.id === id))
              .filter((item): item is EvaluationDimension => Boolean(item));

            return (
              <Card key={domain.id} className={`p-5 ${domain.covered ? "" : "border-dashed bg-paper-warm/40"}`}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-lg font-extrabold tracking-tightish">{getDomainName(domain, language)}</h3>
                  <span className="text-sm text-ink-muted">{language === "zh" ? domain.plainZh : ""}</span>
                  {domain.covered ? (
                    <span className="ml-auto rounded-full bg-tide-50 px-2.5 py-0.5 text-xs font-semibold text-tide-600">
                      {language === "zh" ? `${rubrics.length} 项` : `${rubrics.length} item${rubrics.length === 1 ? "" : "s"}`}
                    </span>
                  ) : (
                    <span className="ml-auto rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-ink-muted">
                      {language === "zh" ? "本工具不单独观察" : "Not scored here"}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm leading-6 text-ink-soft">{getDomainNote(domain, language)}</p>

                {domain.covered ? (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-semibold text-ink-muted">{language === "zh" ? "支撑文献：" : "References: "}</span>
                    {getReferencesForDomain(domain.id).map((reference) => (
                      <a
                        key={reference.id}
                        href={reference.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 font-medium text-tide-600 ring-1 ring-inset ring-tide/15 hover:underline"
                      >
                        {reference.authors.split(",")[0]} {reference.year}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                ) : null}

                {rubrics.length > 0 ? (
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {rubrics.map((dimension) => {
                      const title = language === "zh" ? dimension.title : dimension.titleEn;
                      const summary = language === "zh" ? dimension.summary : dimension.summaryEn;
                      const criteria = language === "zh" ? dimension.criteria : dimension.criteriaEn;
                      const anchor = rubricScaleAnchors[dimension.id];
                      const currentScore = Math.round(dimension.score);
                      return (
                        <div key={dimension.id} className="rounded-xl border border-white/70 bg-white/80 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-display text-base font-bold">{title}</h4>
                            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-extrabold text-white ${scoreTone[currentScore]}`}>
                              {dimension.score % 1 === 0 ? `${dimension.score}/5` : `${dimension.score.toFixed(1)}/5`}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-ink-soft">{summary}</p>

                          <div className="mt-3 rounded-lg border border-white/70 bg-paper-warm/60 p-3">
                            <p className="text-xs font-bold text-ink-muted">{language === "zh" ? "主要看这些行为" : "What to watch"}</p>
                            <ul className="mt-2 space-y-1.5">
                              {criteria.map((item) => (
                                <li key={item} className="flex gap-2 text-sm text-ink-soft">
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tide" aria-hidden="true" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {anchor ? (
                            <div className="mt-3 rounded-lg border border-white/70 bg-white/70 p-3">
                              <p className="text-xs font-bold text-ink-muted">{language === "zh" ? "1–5 分分别代表什么" : "1-5 level guide"}</p>
                              <ul className="mt-2 space-y-1">
                                {([1, 2, 3, 4, 5] as const).map((level) => {
                                  const isCurrent = level === currentScore;
                                  return (
                                    <li
                                      key={level}
                                      className={`flex items-start gap-2 rounded-md px-1.5 py-1 text-xs leading-5 ${
                                        isCurrent ? "bg-tide-50 font-semibold text-ink" : "text-ink-muted"
                                      }`}
                                    >
                                      <span className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-extrabold text-white ${scoreTone[level]}`}>
                                        {level}
                                      </span>
                                      <span>
                                        {(language === "zh" ? anchor.levels : anchor.levelsEn)[level]}
                                        {isCurrent ? <span className="ml-1 text-tide-600">{language === "zh" ? "· 本轮在这一档" : " · current cycle"}</span> : null}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                              <p className="mt-2 rounded-md bg-paper-warm/70 px-2 py-1.5 text-xs leading-5 text-ink-soft">
                                <span className="font-bold">{language === "zh" ? "为什么是这个分：" : "Current score: "}</span>
                                {language === "zh" ? anchor.currentRationaleZh : anchor.currentRationaleEn}
                              </p>
                            </div>
                          ) : null}

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                            <span className="text-ink-muted">
                              {language === "zh" ? "用到的记录：" : "Records used: "}
                              <span className="font-semibold text-ink-soft">{getMetricLabels(dimension.id, language).join(language === "zh" ? "、" : ", ")}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-tide-50 px-2 py-0.5 font-semibold text-tide-600">
                              {language === "zh" ? "参照 · " : "Reference · "}
                              {getFrameworkLabel(dimension.id, language)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      </div>

      {/* 参考依据 */}
      <Card className="p-6">
        <h2 className="font-display text-lg font-extrabold tracking-tightish">{language === "zh" ? "参考文献与依据" : "References"}</h2>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          {language === "zh"
            ? "下面这些研究和工具，是帮我们决定“该看哪些行为、怎么分级描述”的设计参照，不是给孩子做评估或诊断的标准。每条都可点击查看原文。"
            : "These sources inform what to observe and how to describe levels. They are references, not diagnostic standards."}
        </p>
        <ol className="mt-4 space-y-3">
          {references.map((ref) => (
            <li key={ref.id} className="rounded-xl border border-white/70 bg-white/80 p-4">
              <p className="text-sm leading-6">
                <span className="font-semibold">{ref.authors}</span> ({ref.year}).{" "}
                <span className="italic">{ref.title}</span>. {language === "zh" ? ref.source : ref.sourceEn ?? ref.source}.{" "}
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-tide-600 hover:underline"
                >
                  {language === "zh" ? "原文链接" : "Source"}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </p>
              <p className="mt-2 text-xs leading-5 text-ink-soft">{language === "zh" ? ref.contributionZh : ref.contributionEn}</p>
              {ref.caveatZh ? (
                <p className="mt-2 flex items-start gap-1.5 rounded-md bg-coral-50 px-2 py-1.5 text-xs leading-5 text-coral-600">
                  <span className="font-bold">{language === "zh" ? "边界：" : "Note: "}</span>
                  <span className="text-ink-soft">{language === "zh" ? ref.caveatZh : ref.caveatEn}</span>
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </Card>

      {/* 边界声明 */}
      <p className="flex items-start gap-2.5 rounded-2xl border border-moss/20 bg-moss-50 p-5 text-moss-600">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="text-sm leading-6 text-ink-soft">
          {language === "zh"
            ? "这些只是给老师看的观察材料，不是给孩子下结论，也不替代老师、治疗师或医生的判断。相关研究也提醒：这类信号能帮我们更懂孩子，但仍要结合现场情况一起看。"
            : "These are teacher-facing observation notes. They do not replace teacher, therapist, or medical judgment."}
        </span>
      </p>
    </div>
  );
}
