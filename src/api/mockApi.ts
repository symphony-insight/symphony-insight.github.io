import { allInsights, allSessions, auditLogs, children, evaluationDimensions, reportDrafts } from "../data/mockData";
import type { AuditLog, Child, LongitudinalInsight, ReportDraft, ReportStatus, SessionSummary } from "../types/domain";

let currentReports: ReportDraft[] = structuredClone(reportDrafts);
let currentAuditLogs: AuditLog[] = structuredClone(auditLogs);

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(structuredClone(value)), 80));
}

export const mockApi = {
  getChildren(): Promise<Child[]> {
    return delay(children);
  },

  getChild(childId: string): Promise<Child> {
    const child = children.find((item) => item.id === childId);
    if (!child) throw new Error(`Unknown child: ${childId}`);
    return delay(child);
  },

  getSessions(childId: string): Promise<SessionSummary[]> {
    return delay(allSessions.filter((session) => session.childId === childId));
  },

  getInsights(childId: string): Promise<LongitudinalInsight[]> {
    return delay(allInsights.filter((insight) => insight.childId === childId));
  },

  getEvaluationDimensions(childId: string) {
    const offset = childId === "lele" ? 0.2 : childId === "anan" ? -0.2 : 0;
    return delay(evaluationDimensions.map((dimension) => ({ ...dimension, score: Math.max(1, Math.min(5, dimension.score + offset)) })));
  },

  getReportDraft(reportId: string): Promise<ReportDraft> {
    const report = currentReports.find((item) => item.id === reportId);
    if (!report) throw new Error(`Unknown report: ${reportId}`);
    return delay(report);
  },

  getReportDraftByChild(childId: string): Promise<ReportDraft> {
    const report = currentReports.find((item) => item.childId === childId);
    if (!report) throw new Error(`Unknown report for child: ${childId}`);
    return delay(report);
  },

  generateReportDraft(childId: string): Promise<ReportDraft> {
    const report = currentReports.find((item) => item.childId === childId);
    if (!report) return Promise.reject(new Error(`Unknown child: ${childId}`));

    const generatedAt = new Date().toISOString();
    const updatedReport: ReportDraft = {
      ...report,
      status: "teacher_reviewing",
      generation: {
        ...report.generation,
        status: "draft_ready",
        generatedAt
      },
      safetyCheck: {
        ...report.safetyCheck,
        checkedAt: generatedAt,
        displayStatus: report.safetyCheck.containsMedicalClaim ? "blocked" : "passed",
        plainSummary: report.safetyCheck.containsMedicalClaim
          ? "这版草稿暂时不能导出，请先修改标出的表述。"
          : "没有发现不适合直接使用的表述。"
      }
    };

    currentReports = currentReports.map((item) => (item.id === report.id ? updatedReport : item));
    currentAuditLogs = [
      {
        id: `audit-generated-${Date.now()}`,
        childId: updatedReport.childId,
        actor: "报告整理助手",
        action: "report.generated",
        targetType: "report",
        targetId: updatedReport.id,
        createdAt: generatedAt,
        summary: "系统整理了一版报告草稿，等老师确认。"
      },
      ...currentAuditLogs
    ];

    return new Promise((resolve) => window.setTimeout(() => resolve(structuredClone(updatedReport)), 700));
  },

  updateReportStatus(reportId: string, status: ReportStatus, actor: string): Promise<ReportDraft> {
    const report = currentReports.find((item) => item.id === reportId);
    if (!report) throw new Error(`Unknown report: ${reportId}`);
    const updatedReport = { ...report, status };
    currentReports = currentReports.map((item) => (item.id === reportId ? updatedReport : item));
    currentAuditLogs = [
      {
        id: `audit-${Date.now()}`,
        childId: updatedReport.childId,
        actor,
        action: `report.${status}`,
        targetType: "report",
        targetId: reportId,
        createdAt: new Date().toISOString(),
        summary: status === "approved" ? "老师已确认这份报告。" : "老师更新了报告。"
      },
      ...currentAuditLogs
    ];
    return delay(updatedReport);
  },

  getAuditLogs(childId: string): Promise<AuditLog[]> {
    return delay(currentAuditLogs.filter((log) => log.childId === childId));
  },

  resetReviewState(): Promise<void> {
    currentReports = structuredClone(reportDrafts);
    currentAuditLogs = structuredClone(auditLogs);
    return delay(undefined);
  }
};
