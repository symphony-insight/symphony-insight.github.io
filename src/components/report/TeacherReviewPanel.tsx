import type { AuditLog, ReportDraft, ReportStatus } from "../../types/domain";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { StatusPill } from "../ui/StatusPill";

const actionLabels: Record<string, string> = {
  "report.teacher_reviewing": "继续编辑中",
  "report.approved": "老师已确认",
  "report.rejected": "已退回修改",
  "report.exported": "已导出"
};

export function TeacherReviewPanel({
  report,
  auditLogs,
  onStatusChange
}: {
  report: ReportDraft;
  auditLogs: AuditLog[];
  onStatusChange: (status: ReportStatus) => void;
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">老师确认后再导出</h3>
          <p className="mt-1 text-sm text-stone-500">报告不会自动发给家长。老师确认后，才能导出摘要。</p>
        </div>
        <StatusPill status={report.status === "approved" ? "老师已审核通过" : "需要老师复核"} />
      </div>
      <div className="mt-4 rounded-md bg-stone-50 p-3 text-sm text-stone-600">老师备注：{report.teacherNote}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => onStatusChange("teacher_reviewing")}>编辑草稿</Button>
        <Button onClick={() => onStatusChange("rejected")}>退回修改</Button>
        <Button variant="primary" onClick={() => onStatusChange("approved")}>
          确认通过
        </Button>
        <Button onClick={() => onStatusChange("exported")} disabled={report.status !== "approved"}>
          导出摘要
        </Button>
      </div>
      <div className="mt-5">
        <h4 className="text-sm font-bold">操作记录</h4>
        <div className="mt-2 space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="rounded-md border border-stone-200 bg-white p-3 text-sm">
              <p className="font-semibold">{actionLabels[log.action] ?? "老师已更新"}</p>
              <p className="mt-1 text-stone-500">
                {log.actor} · {log.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
