import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockApi } from "../api/mockApi";
import { Sidebar } from "../components/layout/Sidebar";
import { ReportDraftPanel } from "../components/report/ReportDraftPanel";
import { reportDraft } from "../data/mockData";
import { useAppStore } from "../store/useAppStore";
import { MotionAffectPage } from "./MotionAffectPage";
import { OverviewPage } from "./OverviewPage";
import { ReportMethodPage } from "./ReportMethodPage";
import { ReportReviewPage } from "./ReportReviewPage";
import { SessionTimelinePage } from "./SessionTimelinePage";

const forbiddenPhrases = [
  "Session",
  "Motion",
  "Affect",
  "seed",
  "confidence",
  "dimension",
  "rubric",
  "matrix",
  "trace",
  "claim",
  "AI 自动判断",
  "创作素材",
  "老师审核单向阀",
  "家长摘要版",
  "动作-情绪关联",
  "LLM",
  "API",
  "provider",
  "prompt",
  "payload",
  "model id",
  "mock 服务",
  "mock service",
  "系统说明",
  "系统整理",
  "System-prepared",
  "The system prepared",
  "诊断",
  "疗效",
  "病情好转",
  "病情恶化",
  "康复有效",
  "恢复正常"
];

function expectNoForbiddenCopy(container: HTMLElement) {
  const text = container.textContent ?? "";
  for (const phrase of forbiddenPhrases) {
    expect(text).not.toContain(phrase);
  }
}

function expectNoSystemCopy(container: HTMLElement) {
  const text = container.textContent ?? "";
  for (const phrase of ["mock 服务", "mock service", "系统说明", "系统整理", "System-prepared", "The system prepared"]) {
    expect(text).not.toContain(phrase);
  }
}

function expectNoMethodInternalCopy(container: HTMLElement) {
  const text = (container.textContent ?? "").toLowerCase();
  for (const phrase of [
    "mock 服务",
    "mock service",
    "系统说明",
    "系统整理",
    "system-prepared",
    "the system prepared",
    "provider",
    "backend",
    "model",
    "api",
    "prompt",
    "payload",
    "diagnose",
    "condition",
    "diagnosis",
    "clinical",
    "诊断",
    "疗效",
    "病情",
    "康复"
  ]) {
    expect(text).not.toContain(phrase);
  }
  expect(text).not.toMatch(/(^|[^a-z])ai([^a-z]|$)/);
}

function expectNoReportInternalCopy(container: HTMLElement) {
  const text = (container.textContent ?? "").toLowerCase();
  for (const phrase of [
    "mock service",
    "system-prepared",
    "the system prepared",
    "provider",
    "backend",
    "model",
    "api",
    "prompt",
    "payload",
    "diagnose",
    "condition",
    "diagnosis",
    "clinical"
  ]) {
    expect(text).not.toContain(phrase);
  }
  expect(text).not.toMatch(/(^|[^a-z])ai([^a-z]|$)/);
}

describe("core pages", () => {
  beforeEach(async () => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    useAppStore.getState().setLanguage("zh");
    useAppStore.getState().setSelectedChildId("xiaoyu");
    await mockApi.resetReviewState();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("renders the premium overview with readable scores and working search", async () => {
    const user = userEvent.setup();
    const { container } = render(<OverviewPage />);

    expect((await screen.findAllByText(/小宇/)).length).toBeGreaterThan(0);
    expect(screen.getByText(/9 项观察总览/)).toBeInTheDocument();
    expect(screen.getByText(/今天先看这 3 件事/)).toBeInTheDocument();
    expect(screen.getByText("活动记录")).toBeInTheDocument();
    expect(screen.getByText("8 次")).toBeInTheDocument();
    expect(screen.getByText("创作片段")).toBeInTheDocument();
    expect(screen.getByText("20 个")).toBeInTheDocument();
    expect(screen.getByText("最近状态")).toBeInTheDocument();
    expect(screen.getByText("很投入")).toBeInTheDocument();
    expect(screen.getByText("老师")).toBeInTheDocument();
    expect(screen.getByText("陈老师")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: /搜索活动记录/ })).toBeInTheDocument();
    expect(screen.getAllByText(/愿不愿意参加/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/4\/5/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/比较稳/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/关键变化/).length).toBeGreaterThan(0);
    expect(screen.getByText(/操作方式顺不顺手/)).toBeInTheDocument();
    expect(screen.getByText(/这周小目标有没有往前走/)).toBeInTheDocument();
    await user.type(screen.getByRole("searchbox", { name: /搜索活动记录/ }), "参加");
    expect(screen.getAllByText(/愿不愿意参加/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/操作方式顺不顺手/)).not.toBeInTheDocument();
    expectNoSystemCopy(container);
  });

  it("renders the session timeline story from high-brightness withdrawal to completed reveal", async () => {
    const { container } = render(<SessionTimelinePage />);

    expect((await screen.findAllByText(/第 6 次活动/)).length).toBeGreaterThan(0);
    expect(screen.getByText(/高亮动画出现后，他退出了活动/)).toBeInTheDocument();
    expect(screen.getAllByText(/创作片段/).length).toBeGreaterThan(0);
    expect(screen.getByText(/有点吃力/)).toBeInTheDocument();
    expect(screen.getAllByText(/第 8 次活动/).length).toBeGreaterThan(0);
    expect(screen.getByText(/完整的共创活动/)).toBeInTheDocument();
    expect(screen.queryByText(/warmup|reveal|capture_seed/)).not.toBeInTheDocument();
    expectNoForbiddenCopy(container);
  });

  it("renders state-change guidance without internal matrix language", async () => {
    const { container } = render(<MotionAffectPage />);

    expect(await screen.findByText(/哪些设置更适合孩子/)).toBeInTheDocument();
    expect(screen.getByText(/音乐和节奏/)).toBeInTheDocument();
    expect(screen.getAllByText(/画面亮度/).length).toBeGreaterThan(0);
    expect(screen.getByText(/老师怎么帮/)).toBeInTheDocument();
    expect(screen.getByText(/这只是给老师看的活动记录/)).toBeInTheDocument();
    expectNoForbiddenCopy(container);
  });

  it("approves a report and shows user-facing audit copy", async () => {
    const user = userEvent.setup();
    const { container } = render(<ReportReviewPage />);

    expect(await screen.findByText(/老师看的详细版/)).toBeInTheDocument();
    expect(screen.getAllByText(/老师确认后再分享/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/给家长看的摘要/).length).toBeGreaterThan(0);
    expect(screen.getByText("写草稿")).toBeInTheDocument();
    expect(screen.getByText("查表述")).toBeInTheDocument();
    expect(screen.getByText("老师确认")).toBeInTheDocument();
    expect(screen.getAllByText("分享摘要").length).toBeGreaterThan(0);
    expect(screen.getByText("8 次活动记录")).toBeInTheDocument();
    expect(screen.getByText("9 项观察问题")).toBeInTheDocument();
    expect(screen.getByText("6 个观察方向")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /查看评分说明/ })).toHaveAttribute("href", "#/child/xiaoyu/rubrics");
    expect(screen.getByText("没有需要暂缓分享的表述。")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /确认通过/ }));

    await waitFor(() => expect(screen.getAllByText(/老师看过了/).length).toBeGreaterThan(0));
    expect(screen.getAllByText(/老师已确认/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/report.approved/)).not.toBeInTheDocument();
    expectNoSystemCopy(container);
  });

  it("regenerates the report draft and shows a user-facing audit entry", async () => {
    const user = userEvent.setup();
    const { container } = render(<ReportReviewPage />);

    expect(await screen.findByText(/老师看的详细版/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /重写草稿/ }));

    await waitFor(() => expect(screen.getByText(/已更新一版报告草稿/)).toBeInTheDocument());
    expect(screen.getByText(/报告整理助手/)).toBeInTheDocument();
    expect(screen.getByText(/没有需要暂缓分享的表述/)).toBeInTheDocument();
    expectNoSystemCopy(container);
  });

  it("uses the backend API client when backend mode is enabled", async () => {
    const user = userEvent.setup();
    vi.stubEnv("VITE_API_MODE", "backend");
    vi.stubEnv("VITE_API_BASE_URL", "http://127.0.0.1:8000/api/v1");
    const generatedReport = {
      ...reportDraft,
      professionalDraft: {
        ...reportDraft.professionalDraft,
        overview: "后端整理出的报告草稿。"
      },
      generation: {
        ...reportDraft.generation,
        status: "draft_ready" as const
      }
    };
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith("/children/xiaoyu/reports/current")) {
        return { ok: true, json: async () => reportDraft } as Response;
      }
      if (url.endsWith("/children/xiaoyu/audit-logs")) {
        return { ok: true, json: async () => [] } as Response;
      }
      if (url.endsWith("/children/xiaoyu/reports/draft")) {
        expect(init?.method).toBe("POST");
        return { ok: true, json: async () => generatedReport } as Response;
      }
      throw new Error(`Unexpected fetch ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ReportReviewPage />);

    expect(await screen.findByText(/老师看的详细版/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /重写草稿/ }));

    await waitFor(() => expect(screen.getByText("后端整理出的报告草稿。")).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith("http://127.0.0.1:8000/api/v1/children/xiaoyu/reports/draft", expect.objectContaining({ method: "POST" }));
  });

  it("shows a readable report loading error when backend mode cannot load report data", async () => {
    vi.stubEnv("VITE_API_MODE", "backend");
    vi.stubEnv("VITE_API_BASE_URL", "http://127.0.0.1:8000/api/v1");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("Failed to fetch");
      })
    );

    render(<ReportReviewPage />);

    expect(await screen.findByText("报告暂时没加载出来")).toBeInTheDocument();
    expect(screen.getByText("请确认本地服务已经启动，然后刷新页面。")).toBeInTheDocument();
  });

  it("renders English report copy in English mode", async () => {
    useAppStore.getState().setLanguage("en");
    const { container } = render(<ReportReviewPage />);

    expect(await screen.findByText("Teacher draft")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Review draft" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share summary" })).toBeDisabled();
    expect(screen.getByText("No wording needs to be held back before sharing.")).toBeInTheDocument();
    expect(screen.getByText(/This cycle includes eight music co-creation sessions/)).toBeInTheDocument();
    expect(screen.getByText(/Next time, start with softer visuals, a slower tempo, and a familiar melody/)).toBeInTheDocument();
    expect(screen.queryByText(/本轮一共记录了 8 次音乐共创活动/)).not.toBeInTheDocument();
    expect(screen.queryByText(/下次建议用低亮度、慢节奏和熟悉旋律开场/)).not.toBeInTheDocument();
    expectNoReportInternalCopy(container);
  });

  it("shows English audit copy for newly approved reports in English mode", async () => {
    const user = userEvent.setup();
    useAppStore.getState().setLanguage("en");
    const { container } = render(<ReportReviewPage />);

    expect(await screen.findByText("Teacher draft")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Approve" }));

    await waitFor(() => expect(screen.getByText("Teacher Chen · Teacher confirmed this report.")).toBeInTheDocument());
    expect(screen.queryByText("老师已确认这份报告。")).not.toBeInTheDocument();
    expectNoReportInternalCopy(container);
  });

  it("does not allow approving a blocked report from the review page", async () => {
    const user = userEvent.setup();
    useAppStore.getState().setSelectedChildId("anan");
    render(<ReportReviewPage />);

    expect(await screen.findByText(/老师看的详细版/)).toBeInTheDocument();
    const approveButton = screen.getByRole("button", { name: "确认通过" });

    expect(approveButton).toBeDisabled();
    await user.click(approveButton);

    expect(screen.getAllByText(/请老师看一眼/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/老师已确认/)).not.toBeInTheDocument();
  });

  it("renders the report method page and links back to rubric evidence", async () => {
    const user = userEvent.setup();
    useAppStore.getState().setSelectedChildId("xiaoyu");
    render(<ReportMethodPage />);

    expect(screen.getByText("报告依据说明")).toBeInTheDocument();
    expect(screen.getByText("活动中留下记录")).toBeInTheDocument();
    expect(screen.getByText("写成报告草稿")).toBeInTheDocument();
    expect(screen.getByText("把记录写成老师可修改的草稿。")).toBeInTheDocument();
    expect(screen.getByText("不替孩子下结论")).toBeInTheDocument();
    expect(screen.getByText("不读取原始音视频")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /查看评分说明/ })).toHaveAttribute("href", "#/child/xiaoyu/rubrics");
    expect(screen.getByText("处理规则")).toBeInTheDocument();
    expect(screen.getByText("草稿只来自活动记录、评分依据和老师备注。")).not.toBeVisible();
    expect(screen.getByText("本地预览也使用同一套页面和审核流程。")).not.toBeVisible();

    await user.click(screen.getByText("处理规则"));

    expect(screen.getByText("草稿只来自活动记录、评分依据和老师备注。")).toBeInTheDocument();
    expect(screen.getByText("本地预览也使用同一套页面和审核流程。")).toBeInTheDocument();
    expectNoMethodInternalCopy(document.body);
  });

  it("renders the report method page in English mode", async () => {
    const user = userEvent.setup();
    useAppStore.getState().setLanguage("en");
    useAppStore.getState().setSelectedChildId("xiaoyu");
    render(<ReportMethodPage />);

    expect(screen.getByText("How the report is prepared")).toBeInTheDocument();
    expect(screen.getByText("Activity records")).toBeInTheDocument();
    expect(screen.getByText("Write the draft")).toBeInTheDocument();
    expect(screen.getByText("Does not label the child")).toBeInTheDocument();
    expect(screen.getByText("Does not decide whether things got better or worse")).toBeInTheDocument();
    expect(screen.getByText("Does not read raw audio or video")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View scoring guide" })).toHaveAttribute("href", "#/child/xiaoyu/rubrics");
    expect(screen.queryByText("报告依据说明")).not.toBeInTheDocument();
    expect(screen.getByText("Drafts use session records, scoring basis, and teacher notes.")).not.toBeVisible();

    await user.click(screen.getByText("Processing rules"));

    expect(screen.getByText("Drafts use session records, scoring basis, and teacher notes.")).toBeInTheDocument();
    expect(screen.getByText("When live drafting is turned on, teachers keep the same review steps.")).toBeInTheDocument();
    expectNoMethodInternalCopy(document.body);
  });

  it("shows the report method navigation item in the sidebar", async () => {
    useAppStore.getState().setLanguage("zh");
    useAppStore.getState().setSelectedChildId("xiaoyu");
    window.location.hash = "#/child/xiaoyu";
    render(<Sidebar />);

    const navLink = await screen.findByRole("link", { name: "报告依据说明" });
    expect(navLink).toHaveAttribute("href", "#/child/xiaoyu/report-method");
  });

  it("does not show the ready export badge when approval is blocked by safety review", () => {
    const blockedApprovedReport = {
      ...reportDraft,
      status: "approved" as const,
      safetyCheck: {
        ...reportDraft.safetyCheck,
        displayStatus: "blocked" as const,
        plainSummary: "这版草稿暂时不能导出，请先修改标出的表述。",
        plainSummaryEn: "This draft cannot be exported until the highlighted wording is edited."
      }
    };

    render(<ReportDraftPanel report={blockedApprovedReport} language="zh" />);

    expect(screen.queryByText("老师确认后可导出")).not.toBeInTheDocument();
    expect(screen.getByText("先别分享")).toBeInTheDocument();
    expect(screen.getByText("这版草稿里有不适合直接给家长看的表述，需要老师修改后再导出。")).toBeInTheDocument();
  });
});
