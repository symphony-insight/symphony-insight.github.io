import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { mockApi } from "../api/mockApi";
import { useAppStore } from "../store/useAppStore";
import { App } from "./App";

describe("App shell", () => {
  beforeEach(async () => {
    useAppStore.getState().setLanguage("zh");
    useAppStore.getState().setSelectedChildId("xiaoyu");
    await mockApi.resetReviewState();
  });

  it("renders product navigation, safety banner, child switcher, and review control", async () => {
    render(<App />);

    expect(await screen.findByText("共鸣观察台")).toBeInTheDocument();
    expect(screen.getByText("SymPhony Insight")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /总览/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /活动记录/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /状态变化/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /报告审核/ })).toBeInTheDocument();
    expect(screen.getByLabelText("切换儿童档案")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /EN/ })).toBeInTheDocument();
    expect(screen.getByText(/这里只整理活动观察/)).toBeInTheDocument();
    expect(screen.queryByText(/Session 时间轴|动作-情绪关联|STOP/)).not.toBeInTheDocument();
  });

  it("switches between children from the header selector", async () => {
    const user = userEvent.setup();
    render(<App />);

    const selector = await screen.findByLabelText("切换儿童档案");
    await screen.findByRole("option", { name: "乐乐" });
    await user.selectOptions(selector, "lele");

    expect(await screen.findByText(/乐乐 · 8 次共创观察/)).toBeInTheDocument();
  });

  it("switches core navigation and header copy to English", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole("button", { name: "EN" }));

    expect(screen.getByRole("link", { name: /Overview/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Session Timeline/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Motion-Affect/ })).toBeInTheDocument();
    expect(screen.getByText(/Baseline ready/)).toBeInTheDocument();
    expect(screen.getByText(/All findings are observation signals/)).toBeInTheDocument();
  });
});
