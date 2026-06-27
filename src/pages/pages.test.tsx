import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { mockApi } from "../api/mockApi";
import { useAppStore } from "../store/useAppStore";
import { MotionAffectPage } from "./MotionAffectPage";
import { OverviewPage } from "./OverviewPage";
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
    expect(screen.getByText("投入")).toBeInTheDocument();
    expect(screen.getByText("老师复核")).toBeInTheDocument();
    expect(screen.getByText("陈老师")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: /搜索观察内容/ })).toBeInTheDocument();
    expect(screen.getAllByText(/愿不愿意参与/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/4\/5/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/比较稳定/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/观察依据/).length).toBeGreaterThan(0);
    expect(screen.getByText(/操作方式合不合适/)).toBeInTheDocument();
    expect(screen.getByText(/本周目标有没有进展/)).toBeInTheDocument();
    await user.type(screen.getByRole("searchbox", { name: /搜索观察内容/ }), "参与");
    expect(screen.getAllByText(/愿不愿意参与/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/操作方式合不合适/)).not.toBeInTheDocument();
    expectNoForbiddenCopy(container);
  });

  it("renders the session timeline story from high-brightness withdrawal to completed reveal", async () => {
    const { container } = render(<SessionTimelinePage />);

    expect((await screen.findAllByText(/第 6 次活动/)).length).toBeGreaterThan(0);
    expect(screen.getByText(/高亮动画出现后退出/)).toBeInTheDocument();
    expect(screen.getAllByText(/创作片段/).length).toBeGreaterThan(0);
    expect(screen.getByText(/负担偏高/)).toBeInTheDocument();
    expect(screen.getAllByText(/第 8 次活动/).length).toBeGreaterThan(0);
    expect(screen.getByText(/完成完整共创流程/)).toBeInTheDocument();
    expect(screen.queryByText(/warmup|reveal|capture_seed/)).not.toBeInTheDocument();
    expectNoForbiddenCopy(container);
  });

  it("renders state-change guidance without internal matrix language", async () => {
    const { container } = render(<MotionAffectPage />);

    expect(await screen.findByText(/什么设置更适合孩子/)).toBeInTheDocument();
    expect(screen.getByText(/音乐和节奏/)).toBeInTheDocument();
    expect(screen.getAllByText(/画面亮度/).length).toBeGreaterThan(0);
    expect(screen.getByText(/老师支持方式/)).toBeInTheDocument();
    expect(screen.getAllByText(/仅作为老师复核材料/).length).toBeGreaterThan(0);
    expectNoForbiddenCopy(container);
  });

  it("approves a report and shows user-facing audit copy", async () => {
    const user = userEvent.setup();
    const { container } = render(<ReportReviewPage />);

    expect(await screen.findByText(/专业观察版/)).toBeInTheDocument();
    expect(screen.getAllByText(/老师确认后再导出/).length).toBeGreaterThan(0);
    expect(screen.getByText(/给家长看的摘要/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /确认通过/ }));

    await waitFor(() => expect(screen.getAllByText(/老师已审核通过/).length).toBeGreaterThan(0));
    expect(screen.getByText(/老师已确认/)).toBeInTheDocument();
    expect(screen.queryByText(/report.approved/)).not.toBeInTheDocument();
    expectNoForbiddenCopy(container);
  });
});
