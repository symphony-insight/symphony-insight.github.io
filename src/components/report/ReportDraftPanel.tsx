import type { ReportDraft } from "../../types/domain";
import { Card } from "../ui/Card";

export function ReportDraftPanel({ report }: { report: ReportDraft }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="p-5">
        <h3 className="text-lg font-bold">专业观察版</h3>
        <div className="mt-4 space-y-4 text-sm leading-6 text-stone-650">
          <p>{report.professionalDraft.overview}</p>
          <p>{report.professionalDraft.motionObservation}</p>
          <p>{report.professionalDraft.affectObservation}</p>
          <p>{report.professionalDraft.participationObservation}</p>
          <div>
            <p className="font-semibold text-ink">值得人工复核的点</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {report.professionalDraft.reviewPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <p className="rounded-md bg-stone-50 p-3 text-stone-600">{report.professionalDraft.limitationNote}</p>
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="text-lg font-bold">家长摘要版</h3>
        <div className="mt-4 space-y-4 text-sm leading-6 text-stone-650">
          <p>{report.parentSummary.overview}</p>
          <p>{report.parentSummary.positiveMoments}</p>
          <p>{report.parentSummary.nextObservationFocus}</p>
        </div>
      </Card>
    </div>
  );
}
