import type { ReportDraft } from "../../types/domain";
import { Card } from "../ui/Card";

function formatReportCopy(text: string) {
  return text;
}

export function ReportDraftPanel({ report }: { report: ReportDraft }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="p-6">
        <h3 className="font-display text-lg font-extrabold tracking-tightish">老师看的详细版</h3>
        <div className="mt-4 space-y-4 text-sm leading-6 text-ink-soft">
          <p>{formatReportCopy(report.professionalDraft.overview)}</p>
          <p>{formatReportCopy(report.professionalDraft.motionObservation)}</p>
          <p>{formatReportCopy(report.professionalDraft.affectObservation)}</p>
          <p>{formatReportCopy(report.professionalDraft.participationObservation)}</p>
          <div>
            <p className="font-semibold text-ink">需要注意的点</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {report.professionalDraft.reviewPoints.map((point) => (
                <li key={point}>{formatReportCopy(point)}</li>
              ))}
            </ul>
          </div>
          <p className="rounded-xl border border-white/70 bg-paper-warm/70 p-4 text-ink-soft">{formatReportCopy(report.professionalDraft.limitationNote)}</p>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="font-display text-lg font-extrabold tracking-tightish">给家长看的摘要</h3>
        <div className="mt-4 space-y-4 text-sm leading-6 text-ink-soft">
          <p>{formatReportCopy(report.parentSummary.overview)}</p>
          <p>{formatReportCopy(report.parentSummary.positiveMoments)}</p>
          <p>{formatReportCopy(report.parentSummary.nextObservationFocus)}</p>
        </div>
      </Card>
    </div>
  );
}
