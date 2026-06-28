import { describe, expect, it, vi } from "vitest";
import { createBackendApi, getApiClient, resolveApiMode } from "./backendApi";
import { mockApi } from "./mockApi";

describe("backendApi", () => {
  it("calls backend report endpoints with the expected contract", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fetcher = vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      return {
        ok: true,
        json: async () =>
          url.endsWith("/audit-logs")
            ? []
            : {
                id: "report-xiaoyu-8",
                childId: "xiaoyu",
                status: "teacher_reviewing",
                generation: { status: "draft_ready" },
                safetyCheck: { displayStatus: "passed" }
              }
      } as Response;
    });
    const api = createBackendApi({ baseUrl: "http://127.0.0.1:8000/api/v1", fetcher });

    await api.getReportDraftByChild("xiaoyu");
    await api.getAuditLogs("xiaoyu");
    await api.generateReportDraft("xiaoyu");
    await api.updateReportStatus("report-xiaoyu-8", "approved", "陈老师");

    expect(calls.map((call) => call.url)).toEqual([
      "http://127.0.0.1:8000/api/v1/children/xiaoyu/reports/current",
      "http://127.0.0.1:8000/api/v1/children/xiaoyu/audit-logs",
      "http://127.0.0.1:8000/api/v1/children/xiaoyu/reports/draft",
      "http://127.0.0.1:8000/api/v1/reports/report-xiaoyu-8/status"
    ]);
    expect(calls[2].init).toMatchObject({ method: "POST" });
    expect(calls[3].init).toMatchObject({ method: "PATCH", headers: { "Content-Type": "application/json" } });
    expect(JSON.parse(String(calls[3].init?.body))).toEqual({ status: "approved", actor: "陈老师" });
  });

  it("uses readable backend errors instead of leaking transport wording", async () => {
    const api = createBackendApi({
      baseUrl: "http://127.0.0.1:8000/api/v1",
      fetcher: async () =>
        ({
          ok: false,
          status: 409,
          json: async () => ({ error: "blocked_report", message: "这份报告还需要老师先修改表述。" })
        }) as Response
    });

    await expect(api.updateReportStatus("report-xiaoyu-8", "approved", "陈老师")).rejects.toThrow("这份报告还需要老师先修改表述。");
  });

  it("selects mock mode by default and backend mode when requested", () => {
    expect(resolveApiMode({})).toBe("mock");
    expect(resolveApiMode({ VITE_API_MODE: "backend" })).toBe("backend");
    expect(getApiClient({ mode: "mock" })).toBe(mockApi);
    expect(getApiClient({ mode: "backend", baseUrl: "http://127.0.0.1:8000/api/v1" })).not.toBe(mockApi);
  });
});
