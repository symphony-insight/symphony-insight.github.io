import { CheckCircle2, FileText, ShieldCheck, Upload } from "lucide-react";
import type { Language, ReportDraft } from "../../types/domain";

const stepCopy = {
  zh: [
    { key: "draft", title: "整理草稿", description: "来自活动记录和观察问题", icon: FileText },
    { key: "safety", title: "检查表述", description: "标出不适合直接使用的话", icon: ShieldCheck },
    { key: "review", title: "老师确认", description: "老师可以修改、退回或通过", icon: CheckCircle2 },
    { key: "export", title: "导出摘要", description: "通过后才能给家长", icon: Upload }
  ],
  en: [
    { key: "draft", title: "Draft report", description: "From session notes and rubric evidence", icon: FileText },
    { key: "safety", title: "Check wording", description: "Flag wording not ready to share", icon: ShieldCheck },
    { key: "review", title: "Teacher review", description: "Edit, send back, or approve", icon: CheckCircle2 },
    { key: "export", title: "Export summary", description: "Share only after approval", icon: Upload }
  ]
} as const;

function getActiveIndex(report: ReportDraft, isGenerating: boolean) {
  if (isGenerating || report.generation.status === "generating") {
    return 0;
  }
  if (report.status === "draft" || report.generation.status === "not_started" || report.generation.status === "draft_ready") {
    return 0;
  }
  if (
    report.generation.status === "blocked" ||
    report.safetyCheck.displayStatus === "blocked" ||
    report.safetyCheck.displayStatus === "needs_edit"
  ) {
    return 1;
  }
  if (report.status === "exported") {
    return 4;
  }
  if (report.status === "approved") {
    return 3;
  }
  if (report.status === "teacher_reviewing" || report.status === "rejected" || report.generation.status === "needs_teacher_review") {
    return 2;
  }
  return 0;
}

export function ReportWorkflowSteps({
  report,
  isGenerating = false,
  language
}: {
  report: ReportDraft;
  isGenerating?: boolean;
  language: Language;
}) {
  const activeIndex = getActiveIndex(report, isGenerating);
  const steps = stepCopy[language];

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isDone = index < activeIndex;
        const isActive = index === activeIndex || (activeIndex === 4 && index === 3);

        return (
          <div
            key={step.key}
            aria-current={isActive ? "step" : undefined}
            className={`rounded-2xl border p-4 ${
              isActive
                ? "border-tide/30 bg-tide-50 shadow-card"
                : isDone
                  ? "border-moss/20 bg-moss-50/70"
                  : "border-white/70 bg-white/70"
            }`}
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
