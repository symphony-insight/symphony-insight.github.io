import type { ReportDraft } from "../../types/domain";
import { Card } from "../ui/Card";

function formatReportCopy(text: string) {
  return text
    .replace(/创作素材/g, "创作片段")
    .replace(/情绪/g, "状态")
    .replace(/治疗师或医生/g, "相关专业人员");
}

export function ReportDraftPanel({ report }: { report: ReportDraft }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="p-5">
        <h3 className="text-lg font-bold">专业观察版</h3>
        <div className="mt-4 space-y-4 text-sm leading-6 text-stone-600">
          <p>{formatReportCopy(report.professionalDraft.overview)}</p>
          <p>{formatReportCopy(report.professionalDraft.motionObservation)}</p>
          <p>{formatReportCopy(report.professionalDraft.affectObservation)}</p>
          <p>{formatReportCopy(report.professionalDraft.participationObservation)}</p>
          <div>
            <p className="font-semibold text-ink">值得人工复核的点</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {report.professionalDraft.reviewPoints.map((point) => (
                <li key={point}>{formatReportCopy(point)}</li>
              ))}
            </ul>
          </div>
          <p className="rounded-md bg-stone-50 p-3 text-stone-600">{formatReportCopy(report.professionalDraft.limitationNote)}</p>
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="text-lg font-bold">给家长看的摘要</h3>
        <div className="mt-4 space-y-4 text-sm leading-6 text-stone-600">
          <p>{formatReportCopy(report.parentSummary.overview)}</p>
          <p>{formatReportCopy(report.parentSummary.positiveMoments)}</p>
          <p>{formatReportCopy(report.parentSummary.nextObservationFocus)}</p>
        </div>
      </Card>
    </div>
  );
}
