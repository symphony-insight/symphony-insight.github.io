import { BookOpen, ClipboardCheck, FileText, Layers } from "lucide-react";
import type { Language, ReportDraft } from "../../types/domain";
import { Card } from "../ui/Card";

const copy = {
  zh: {
    title: "草稿来自哪里",
    body: "这份草稿来自活动里的记录和老师可复核的评分，不会自动判断孩子情况。",
    guideLabel: "查看评分说明",
    cards: [
      { key: "sessions", icon: FileText, title: "活动记录", value: (report: ReportDraft) => `${report.generation.sourceSessionCount} 次活动记录` },
      { key: "rubrics", icon: ClipboardCheck, title: "观察问题", value: (report: ReportDraft) => `${report.generation.sourceRubricCount} 项观察问题` },
      { key: "domains", icon: Layers, title: "观察方向", value: (report: ReportDraft) => `${report.generation.sourceDomainCount} 个观察方向` },
      { key: "notes", icon: BookOpen, title: "老师备注", value: () => "已纳入" }
    ]
  },
  en: {
    title: "Report sources",
    body: "This draft is based on session notes and teacher-reviewable rubric evidence. It does not make automatic judgments about the child.",
    guideLabel: "View rubric guide",
    cards: [
      { key: "sessions", icon: FileText, title: "Session notes", value: (report: ReportDraft) => `${report.generation.sourceSessionCount} sessions` },
      { key: "rubrics", icon: ClipboardCheck, title: "Rubric items", value: (report: ReportDraft) => `${report.generation.sourceRubricCount} items` },
      { key: "domains", icon: Layers, title: "Observation domains", value: (report: ReportDraft) => `${report.generation.sourceDomainCount} domains` },
      { key: "notes", icon: BookOpen, title: "Teacher notes", value: () => "Included" }
    ]
  }
} as const;

export function ReportSourceSummary({
  report,
  childId,
  language
}: {
  report: ReportDraft;
  childId: string;
  language: Language;
}) {
  const content = copy[language];

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-extrabold tracking-tightish">{content.title}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-ink-muted">{content.body}</p>
        </div>
        <a
          href={`#/child/${childId}/rubrics`}
          className="inline-flex h-9 items-center rounded-xl bg-white/85 px-3 text-sm font-bold text-tide-600 ring-1 ring-inset ring-tide/15 transition hover:bg-tide-50"
        >
          {content.guideLabel}
        </a>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {content.cards.map((item) => {
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
