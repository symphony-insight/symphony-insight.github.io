import { Brain, CheckCircle2, ExternalLink, ShieldCheck, XCircle } from "lucide-react";
import { ReportMethodFlow } from "../components/report/ReportMethodFlow";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { t } from "../i18n";
import { useAppStore } from "../store/useAppStore";

const pageCopy = {
  zh: {
    kicker: "报告说明",
    canDoTitle: "会做什么",
    canDo: ["把结构化记录写成草稿", "把专业表述改得更容易读", "检查有没有不该直接使用的话"],
    cannotDoTitle: "不会做什么",
    cannotDo: ["不诊断", "不判断病情变好或变坏", "不自动给家长发送", "不替代老师判断", "不读取原始音视频"],
    sourcesTitle: "这份报告用了哪些资料",
    sourcesBody: "评分依据来自现有评分说明页，那里保留每项分数、行为和数据依据。",
    sourcesLink: "查看评分说明",
    sources: ["活动次数", "观察问题", "评分依据", "老师备注", "生成记录", "审核记录"],
    detailsTitle: "更详细的系统说明",
    details: [
      "AI 网关统一管理报告草稿服务。",
      "密钥只在后端保存，前端不会直接调用模型。",
      "生成结果会保存版本、检查结果和操作记录。",
      "当前前端使用 mock 服务模拟生成过程。",
      "后端接入真实模型服务时，页面结构不需要重做。",
      "9 项观察问题的评分不会调用 AI。"
    ]
  },
  en: {
    kicker: "Report method",
    canDoTitle: "What it does",
    canDo: ["Turn structured records into a draft", "Rewrite specialist wording into easier reading", "Check whether any wording should be held back"],
    cannotDoTitle: "What it does not do",
    cannotDo: ["It does not diagnose", "It does not judge whether a condition improved or worsened", "It does not send anything to parents automatically", "It does not replace teacher judgment", "It does not read raw audio or video"],
    sourcesTitle: "What this report uses",
    sourcesBody: "Scoring logic stays on the rubric guide page, where each score remains tied to concrete behavior and data evidence.",
    sourcesLink: "View rubric guide",
    sources: ["Session count", "Observation questions", "Scoring basis", "Teacher notes", "Draft history", "Review history"],
    detailsTitle: "More detailed system notes",
    details: [
      "The AI gateway manages the draft-generation service.",
      "Keys stay on the backend; the frontend does not call the model directly.",
      "Generated drafts keep versions, checks, and action logs.",
      "The current frontend uses a mock service to simulate generation.",
      "When a real model service is connected, the page structure does not need to change.",
      "The nine observation-question scores are not produced by AI."
    ]
  }
} as const;

export function ReportMethodPage() {
  const { language, selectedChildId } = useAppStore();
  const content = pageCopy[language];

  return (
    <div className="space-y-6 page-enter">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">{content.kicker}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tightish md:text-4xl">{t(language, "reportMethodTitle")}</h1>
        <p className="mt-2 max-w-3xl text-ink-muted">{t(language, "reportMethodIntro")}</p>
      </div>

      <ReportMethodFlow />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-tide-600" aria-hidden="true" />
            <h2 className="font-display text-lg font-extrabold tracking-tightish">{content.canDoTitle}</h2>
          </div>
          <div className="mt-4 space-y-2">
            {content.canDo.map((item) => (
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
            <h2 className="font-display text-lg font-extrabold tracking-tightish">{content.cannotDoTitle}</h2>
          </div>
          <div className="mt-4 space-y-2">
            {content.cannotDo.map((item) => (
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
            <h2 className="font-display text-lg font-extrabold tracking-tightish">{content.sourcesTitle}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-muted">{content.sourcesBody}</p>
          </div>
          <a
            href={`#/child/${selectedChildId}/rubrics`}
            className="inline-flex h-9 items-center gap-1 rounded-xl bg-white/85 px-3 text-sm font-bold text-tide-600 ring-1 ring-inset ring-tide/15 transition hover:bg-tide-50"
          >
            {content.sourcesLink}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {content.sources.map((source, index) => (
            <Badge key={source} tone={index < 3 ? "tide" : "neutral"}>
              {source}
            </Badge>
          ))}
        </div>
      </Card>

      <details className="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-card">
        <summary className="cursor-pointer font-display text-base font-extrabold tracking-tightish">{content.detailsTitle}</summary>
        <div className="mt-4 space-y-2 text-sm leading-6 text-ink-soft">
          {content.details.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </details>
    </div>
  );
}
