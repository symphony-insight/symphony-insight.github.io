import type { AuditLog, ReportDraft, ReportStatus } from "../types/domain";
import { mockApi } from "./mockApi";

type BackendApiOptions = {
  baseUrl: string;
  fetcher?: (url: string, init?: RequestInit) => Promise<Response>;
};

export type ReportApiClient = Pick<
  typeof mockApi,
  "getReportDraftByChild" | "generateReportDraft" | "updateReportStatus" | "getAuditLogs"
>;

export function resolveApiMode(env: Record<string, string | undefined>): "mock" | "backend" {
  return env.VITE_API_MODE === "backend" ? "backend" : "mock";
}

export function createBackendApi({ baseUrl, fetcher = fetch }: BackendApiOptions): ReportApiClient {
  const root = baseUrl.replace(/\/$/, "");

  return {
    getReportDraftByChild(childId: string): Promise<ReportDraft> {
      return request<ReportDraft>(`${root}/children/${encodeURIComponent(childId)}/reports/current`, {}, fetcher);
    },

    generateReportDraft(childId: string): Promise<ReportDraft> {
      return request<ReportDraft>(
        `${root}/children/${encodeURIComponent(childId)}/reports/draft`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        },
        fetcher
      );
    },

    updateReportStatus(reportId: string, status: ReportStatus, actor: string): Promise<ReportDraft> {
      return request<ReportDraft>(
        `${root}/reports/${encodeURIComponent(reportId)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, actor })
        },
        fetcher
      );
    },

    getAuditLogs(childId: string): Promise<AuditLog[]> {
      return request<AuditLog[]>(`${root}/children/${encodeURIComponent(childId)}/audit-logs`, {}, fetcher);
    }
  };
}

export function getApiClient(options?: { mode?: "mock" | "backend"; baseUrl?: string }): ReportApiClient {
  const mode = options?.mode ?? resolveApiMode(import.meta.env);
  if (mode !== "backend") {
    return mockApi;
  }
  const baseUrl = options?.baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";
  return createBackendApi({ baseUrl });
}

async function request<T>(url: string, init: RequestInit, fetcher: (url: string, init?: RequestInit) => Promise<Response>): Promise<T> {
  const response = await fetcher(url, init);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof payload?.message === "string" && payload.message.trim() ? payload.message : "暂时没取到这份记录，请稍后再试。";
    throw new Error(message);
  }
  return payload as T;
}
