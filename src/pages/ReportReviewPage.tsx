import { useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";
import { ReportDraftPanel } from "../components/report/ReportDraftPanel";
import { TeacherReviewPanel } from "../components/report/TeacherReviewPanel";
import { t } from "../i18n";
import { useAppStore } from "../store/useAppStore";
import type { AuditLog, ReportDraft, ReportStatus } from "../types/domain";

export function ReportReviewPage() {
  const [report, setReport] = useState<ReportDraft | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const { language, selectedChildId } = useAppStore();

  const refresh = () => {
    Promise.all([mockApi.getReportDraftByChild(selectedChildId), mockApi.getAuditLogs(selectedChildId)]).then(([reportData, auditData]) => {
      setReport(reportData);
      setAuditLogs(auditData);
    });
  };

  useEffect(() => {
    refresh();
  }, [selectedChildId]);

  const updateStatus = (status: ReportStatus) => {
    if (!report) return;
    mockApi.updateReportStatus(report.id, status, "陈老师").then(refresh);
  };

  if (!report) return <div>{language === "zh" ? "报告加载中" : "Loading report"}</div>;

  return (
    <div className="space-y-6 page-enter">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-coral-600">{t(language, "report")}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tightish md:text-4xl">{t(language, "reportTitle")}</h1>
        <p className="mt-2 max-w-3xl text-ink-muted">{t(language, "reportIntro")}</p>
      </div>
      <TeacherReviewPanel report={report} auditLogs={auditLogs} onStatusChange={updateStatus} />
      <ReportDraftPanel report={report} />
    </div>
  );
}
