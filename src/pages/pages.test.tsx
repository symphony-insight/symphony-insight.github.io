import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
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

describe("core pages", () => {
  beforeEach(async () => {
    useAppStore.getState().setLanguage("zh");
    useAppStore.getState().setSelectedChildId("xiaoyu");
    await mockApi.resetReviewState();
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
    expectNoForbiddenCopy(container);
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

    expect(await screen.findByText(/哪种设置更适合孩子/)).toBeInTheDocument();
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
    expect(screen.getAllByText(/老师看过后再导出/).length).toBeGreaterThan(0);
    expect(screen.getByText(/给家长看的摘要/)).toBeInTheDocument();
    expect(screen.getByText("整理草稿")).toBeInTheDocument();
    expect(screen.getByText("检查表述")).toBeInTheDocument();
    expect(screen.getByText("老师确认")).toBeInTheDocument();
    expect(screen.getByText("导出摘要")).toBeInTheDocument();
    expect(screen.getByText("8 次")).toBeInTheDocument();
    expect(screen.getByText("9 项")).toBeInTheDocument();
    expect(screen.getByText("6 个")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /查看评分说明/ })).toHaveAttribute("href", "#/child/xiaoyu/rubrics");
    expect(screen.getByText("没有发现不适合直接使用的表述。")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /确认通过/ }));

    await waitFor(() => expect(screen.getAllByText(/老师看过了/).length).toBeGreaterThan(0));
    expect(screen.getAllByText(/老师已确认/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/report.approved/)).not.toBeInTheDocument();
    expectNoForbiddenCopy(container);
  });

  it("regenerates the report draft and shows a user-facing system audit entry", async () => {
    const user = userEvent.setup();
    render(<ReportReviewPage />);

    expect(await screen.findByText(/老师看的详细版/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /重新整理草稿/ }));

    await waitFor(() => expect(screen.getByText(/系统整理了一版报告草稿/)).toBeInTheDocument());
    expect(screen.getByText(/报告整理助手/)).toBeInTheDocument();
    expect(screen.getByText(/没有发现不适合直接使用的表述/)).toBeInTheDocument();
  });

  it("renders English report copy in English mode", async () => {
    useAppStore.getState().setLanguage("en");
    render(<ReportReviewPage />);

    expect(await screen.findByText("Teacher-facing draft")).toBeInTheDocument();
    expect(screen.getByText(/This cycle includes eight music co-creation sessions/)).toBeInTheDocument();
    expect(screen.getByText(/Next time, start with softer visuals, a slower tempo, and a familiar melody/)).toBeInTheDocument();
    expect(screen.queryByText(/本轮一共记录了 8 次音乐共创活动/)).not.toBeInTheDocument();
    expect(screen.queryByText(/下次建议用低亮度、慢节奏和熟悉旋律开场/)).not.toBeInTheDocument();
  });

  it("shows English audit copy for newly approved reports in English mode", async () => {
    const user = userEvent.setup();
    useAppStore.getState().setLanguage("en");
    render(<ReportReviewPage />);

    expect(await screen.findByText("Teacher-facing draft")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Approve" }));

    await waitFor(() => expect(screen.getByText("Teacher Chen · Teacher confirmed this report.")).toBeInTheDocument());
    expect(screen.queryByText("老师已确认这份报告。")).not.toBeInTheDocument();
  });

  it("renders the report method page and links back to rubric evidence", () => {
    useAppStore.getState().setSelectedChildId("xiaoyu");
    render(<ReportMethodPage />);

    expect(screen.getByText("报告怎么来的")).toBeInTheDocument();
    expect(screen.getByText("活动中留下记录")).toBeInTheDocument();
    expect(screen.getByText("生成报告草稿")).toBeInTheDocument();
    expect(screen.getByText("把结构化记录写成草稿")).toBeInTheDocument();
    expect(screen.getByText("不诊断")).toBeInTheDocument();
    expect(screen.getByText("不读取原始音视频")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /查看评分说明/ })).toHaveAttribute("href", "#/child/xiaoyu/rubrics");
    expect(screen.getByText("更详细的系统说明")).toBeInTheDocument();
    expect(screen.queryByText("康复有效")).not.toBeInTheDocument();
    expect(screen.queryByText("恢复正常")).not.toBeInTheDocument();
  });

  it("renders the report method page in English mode", () => {
    useAppStore.getState().setLanguage("en");
    useAppStore.getState().setSelectedChildId("xiaoyu");
    render(<ReportMethodPage />);

    expect(screen.getByText("How Reports Work")).toBeInTheDocument();
    expect(screen.getByText("Activity records")).toBeInTheDocument();
    expect(screen.getByText("Report draft")).toBeInTheDocument();
    expect(screen.getByText("Does not read raw audio or video")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View scoring guide" })).toHaveAttribute("href", "#/child/xiaoyu/rubrics");
    expect(screen.queryByText("报告怎么来的")).not.toBeInTheDocument();
  });

  it("shows the report method navigation item in the sidebar", async () => {
    useAppStore.getState().setLanguage("zh");
    useAppStore.getState().setSelectedChildId("xiaoyu");
    window.location.hash = "#/child/xiaoyu";
    render(<Sidebar />);

    const navLink = await screen.findByRole("link", { name: "报告怎么来的" });
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
    expect(screen.getByText("确认前不导出")).toBeInTheDocument();
    expect(screen.getByText("这版草稿里有不适合直接给家长看的表述，需要老师修改后再导出。")).toBeInTheDocument();
  });
});
