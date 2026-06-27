import type { AuditLog, ReportDraft, ReportStatus } from "../../types/domain";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { StatusPill } from "../ui/StatusPill";

const actionLabels: Record<string, string> = {
  "report.teacher_reviewing": "还在编辑",
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
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-extrabold tracking-tightish">老师看过后再导出</h3>
          <p className="mt-1 text-sm text-ink-muted">报告不会自动发给家长。老师看过后，才能导出摘要。</p>
        </div>
        <StatusPill status={report.status === "approved" ? "老师看过了" : "请老师看一眼"} />
      </div>
      <div className="mt-4 rounded-xl border border-white/70 bg-paper-warm/70 p-4 text-sm leading-6 text-ink-soft">复核备注：{report.teacherNote}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => onStatusChange("teacher_reviewing")}>继续编辑</Button>
        <Button onClick={() => onStatusChange("rejected")}>退回修改</Button>
        <Button variant="primary" onClick={() => onStatusChange("approved")}>
          确认通过
        </Button>
        <Button onClick={() => onStatusChange("exported")} disabled={report.status !== "approved"}>
          导出给家长
        </Button>
      </div>
      <div className="mt-6">
        <h4 className="text-sm font-bold text-ink-soft">操作记录</h4>
        <div className="mt-3 space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 rounded-xl border border-white/70 bg-white/80 p-3 text-sm">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-tide" aria-hidden="true" />
              <div>
                <p className="font-semibold">{actionLabels[log.action] ?? "更新了记录"}</p>
                <p className="mt-0.5 text-ink-muted">
                  {log.actor} · {log.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
