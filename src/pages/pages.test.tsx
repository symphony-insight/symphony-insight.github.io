import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MotionAffectPage } from "./MotionAffectPage";
import { OverviewPage } from "./OverviewPage";
import { ReportReviewPage } from "./ReportReviewPage";
import { SessionTimelinePage } from "./SessionTimelinePage";

const forbiddenPhrases = ["诊断", "疗效", "病情好转", "病情恶化", "康复有效", "恢复正常"];

function expectNoForbiddenCopy(container: HTMLElement) {
  const text = container.textContent ?? "";
  for (const phrase of forbiddenPhrases) {
    expect(text).not.toContain(phrase);
  }
}

describe("core pages", () => {
  it("renders the overview with Xiaoyu, 8 sessions, and professional review framing", async () => {
    const { container } = render(<OverviewPage />);

    expect((await screen.findAllByText(/小宇/)).length).toBeGreaterThan(0);
    expect(screen.getByText(/8 次共创活动/)).toBeInTheDocument();
    expect(screen.getAllByText(/需要老师复核/).length).toBeGreaterThan(0);
    expect(screen.getByText(/9 个观察问题/)).toBeInTheDocument();
    expect(screen.getByText(/今天老师可以先看这三件事/)).toBeInTheDocument();
    expect(screen.getByText(/愿不愿意参与/)).toBeInTheDocument();
    expect(screen.getByText(/孩子能不能主动开始或继续活动/)).toBeInTheDocument();
    expect(screen.getAllByText(/1 分：几乎没有出现或明显不舒服/)).toHaveLength(9);
    expect(screen.getByText(/操作方式合不合适/)).toBeInTheDocument();
    expect(screen.getByText(/本周目标有没有进展/)).toBeInTheDocument();
    expect(screen.getByText(/熟悉旋律下参与更稳定/)).toBeInTheDocument();
    expectNoForbiddenCopy(container);
  });

  it("renders the session timeline story from high-brightness withdrawal to completed reveal", async () => {
    render(<SessionTimelinePage />);

    expect((await screen.findAllByText(/Session 6/)).length).toBeGreaterThan(0);
    expect(screen.getByText(/高亮动画出现后退出/)).toBeInTheDocument();
    expect(screen.getAllByText(/创作素材/).length).toBeGreaterThan(0);
    expect(screen.getByText(/负担偏高/)).toBeInTheDocument();
    expect(screen.queryByText(/^seed$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^overloaded$/)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Session 8/).length).toBeGreaterThan(0);
    expect(screen.getByText(/完成完整共创流程/)).toBeInTheDocument();
  });

  it("renders motion-affect observation-only evidence", async () => {
    const { container } = render(<MotionAffectPage />);

    expect(await screen.findByText(/动作和状态关系/)).toBeInTheDocument();
    expect(screen.getByText(/平静/)).toBeInTheDocument();
    expect(screen.queryByText(/Motion x Affect Matrix/)).not.toBeInTheDocument();
    expect(screen.getByText(/过载前 30 秒观察信号/)).toBeInTheDocument();
    expect(screen.getByText(/仅作为老师复核材料/)).toBeInTheDocument();
    expectNoForbiddenCopy(container);
  });

  it("approves a report and reveals an audit entry", async () => {
    const user = userEvent.setup();
    render(<ReportReviewPage />);

    expect(await screen.findByText(/专业观察版/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /通过/ }));

    await waitFor(() => expect(screen.getAllByText(/老师已审核通过/).length).toBeGreaterThan(0));
    expect(screen.getByText(/report.approved/)).toBeInTheDocument();
  });
});
