import type { Language, ReportDraft } from "../../types/domain";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

function formatReportCopy(text: string) {
  return text;
}

const copy = {
  zh: {
    professionalTitle: "老师看的详细版",
    professionalBadge: "待老师确认",
    reviewPointsTitle: "需要注意的点",
    parentTitle: "给家长看的摘要",
    parentReady: "老师确认后可导出",
    parentBlocked: "先别分享",
    parentBlockedBody: "这版草稿里有不适合直接给家长看的表述，需要老师修改后再导出。"
  },
  en: {
    professionalTitle: "Teacher draft",
    professionalBadge: "Needs review",
    reviewPointsTitle: "Review points",
    parentTitle: "Parent summary",
    parentReady: "Ready to share",
    parentBlocked: "Hold for review",
    parentBlockedBody: "This draft still has wording that should be edited before exporting a parent-facing summary."
  }
} as const;

export function ReportDraftPanel({
  report,
  language
}: {
  report: ReportDraft;
  language: Language;
}) {
  const content = copy[language];
  const professionalDraft = language === "zh" ? report.professionalDraft : report.professionalDraftEn;
  const parentSummary = language === "zh" ? report.parentSummary : report.parentSummaryEn;
  const isReadyToExport =
    (report.status === "approved" || report.status === "exported") && report.safetyCheck.displayStatus !== "blocked";

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-extrabold tracking-tightish">{content.professionalTitle}</h3>
          <Badge tone="tide">{content.professionalBadge}</Badge>
        </div>
        <div className="mt-4 space-y-4 text-sm leading-6 text-ink-soft">
          <p>{formatReportCopy(professionalDraft.overview)}</p>
          <p>{formatReportCopy(professionalDraft.motionObservation)}</p>
          <p>{formatReportCopy(professionalDraft.affectObservation)}</p>
          <p>{formatReportCopy(professionalDraft.participationObservation)}</p>
          <div>
            <p className="font-semibold text-ink">{content.reviewPointsTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {professionalDraft.reviewPoints.map((point) => (
                <li key={point}>{formatReportCopy(point)}</li>
              ))}
            </ul>
          </div>
          <p className="rounded-xl border border-white/70 bg-paper-warm/70 p-4 text-ink-soft">{formatReportCopy(professionalDraft.limitationNote)}</p>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-extrabold tracking-tightish">{content.parentTitle}</h3>
          <Badge tone={isReadyToExport ? "moss" : "coral"}>{isReadyToExport ? content.parentReady : content.parentBlocked}</Badge>
        </div>
        {report.safetyCheck.displayStatus === "blocked" ? (
          <p className="mt-4 rounded-xl border border-coral/20 bg-coral-50 p-4 text-sm leading-6 text-ink-soft">{content.parentBlockedBody}</p>
        ) : (
          <div className="mt-4 space-y-4 text-sm leading-6 text-ink-soft">
            <p>{formatReportCopy(parentSummary.overview)}</p>
            <p>{formatReportCopy(parentSummary.positiveMoments)}</p>
            <p>{formatReportCopy(parentSummary.nextObservationFocus)}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
