import { RefreshCw } from "lucide-react";
import type { AuditLog, Language, ReportDraft, ReportStatus } from "../../types/domain";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { StatusPill } from "../ui/StatusPill";
import { ReportSafetyNotice } from "./ReportSafetyNotice";

const copy = {
  zh: {
    title: "老师确认后再分享",
    intro: "先改草稿，再决定是否给家长。摘要不会自动发送。",
    reviewNoteLabel: "老师备注：",
    statusReady: "老师看过了",
    statusPending: "请老师看一眼",
    continueEditing: "继续改",
    regenerate: "重写草稿",
    regenerating: "正在重写",
    reject: "退回修改",
    approve: "确认通过",
    export: "分享摘要",
    auditTitle: "操作记录",
    auditFallback: "更新了记录"
  },
  en: {
    title: "Review before sharing",
    intro: "Edit the draft first, then decide what is ready for parents. Nothing is sent automatically.",
    reviewNoteLabel: "Review note:",
    statusReady: "Teacher approved",
    statusPending: "Needs teacher review",
    continueEditing: "Review draft",
    regenerate: "Rewrite draft",
    regenerating: "Rewriting",
    reject: "Return",
    approve: "Approve",
    export: "Share summary",
    auditTitle: "Activity log",
    auditFallback: "Updated the record"
  }
} as const;

const actionLabels: Record<Language, Record<string, string>> = {
  zh: {
    "report.teacher_reviewing": "还在编辑",
    "report.approved": "老师已确认",
    "report.rejected": "已退回修改",
    "report.exported": "已导出",
    "report.generated": "已更新草稿"
  },
  en: {
    "report.teacher_reviewing": "Still editing",
    "report.approved": "Teacher approved",
    "report.rejected": "Sent back",
    "report.exported": "Exported",
    "report.generated": "Draft regenerated"
  }
};

export function TeacherReviewPanel({
  report,
  auditLogs,
  isGenerating,
  language,
  onRegenerateDraft,
  onStatusChange
}: {
  report: ReportDraft;
  auditLogs: AuditLog[];
  isGenerating: boolean;
  language: Language;
  onRegenerateDraft: () => void;
  onStatusChange: (status: ReportStatus) => void;
}) {
  const content = copy[language];
  const teacherNote = language === "zh" ? report.teacherNote : report.teacherNoteEn;
  const isSafetyBlocked = report.safetyCheck.displayStatus === "blocked";

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-extrabold tracking-tightish">{content.title}</h3>
          <p className="mt-1 text-sm text-ink-muted">{content.intro}</p>
        </div>
        <StatusPill status={report.status === "approved" ? content.statusReady : content.statusPending} />
      </div>
      <div className="mt-4 rounded-xl border border-white/70 bg-paper-warm/70 p-4 text-sm leading-6 text-ink-soft">
        {content.reviewNoteLabel}{" "}
        {teacherNote}
      </div>
      <div className="mt-4">
        <ReportSafetyNotice safetyCheck={report.safetyCheck} language={language} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => onStatusChange("teacher_reviewing")}>{content.continueEditing}</Button>
        <Button onClick={onRegenerateDraft} disabled={isGenerating}>
          <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} aria-hidden="true" />
          {isGenerating ? content.regenerating : content.regenerate}
        </Button>
        <Button onClick={() => onStatusChange("rejected")}>{content.reject}</Button>
        <Button variant="primary" onClick={() => onStatusChange("approved")} disabled={isSafetyBlocked}>
          {content.approve}
        </Button>
        <Button
          onClick={() => onStatusChange("exported")}
          disabled={report.status !== "approved" || isSafetyBlocked}
        >
          {content.export}
        </Button>
      </div>
      <div className="mt-6">
        <h4 className="text-sm font-bold text-ink-soft">{content.auditTitle}</h4>
        <div className="mt-3 space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 rounded-xl border border-white/70 bg-white/80 p-3 text-sm">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-tide" aria-hidden="true" />
              <div>
                <p className="font-semibold">{actionLabels[language][log.action] ?? content.auditFallback}</p>
                <p className="mt-0.5 text-ink-muted">
                  {(language === "zh" ? log.actor : log.actorEn ?? log.actor)} · {(language === "zh" ? log.summary : log.summaryEn ?? log.summary)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
