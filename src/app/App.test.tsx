import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App shell", () => {
  it("renders product navigation, safety banner, and STOP control", async () => {
    render(<App />);

    expect(await screen.findByText("共鸣观察台")).toBeInTheDocument();
    expect(screen.getByText("SymPhony Insight")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /观察总览/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Session 时间轴/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /动作-情绪关联/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /报告审核/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /STOP/ })).toBeInTheDocument();
    expect(screen.getByText(/所有结论均为观察信号/)).toBeInTheDocument();
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
    expect(screen.getByText("Current Profile")).toBeInTheDocument();
    expect(screen.getByText(/All findings are observation signals/)).toBeInTheDocument();
  });
});
