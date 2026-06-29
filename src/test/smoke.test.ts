import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { resolveRoute } from "../app/routes";
import { useAppStore } from "../store/useAppStore";

describe("route smoke tests", () => {
  it("renders the report method route", () => {
    useAppStore.getState().setLanguage("zh");
    useAppStore.getState().setSelectedChildId("xiaoyu");
    render(resolveRoute("#/child/xiaoyu/report-method"));

    expect(screen.getByText("报告依据说明")).toBeInTheDocument();
  });

  it("renders the report review route without blank content", async () => {
    useAppStore.getState().setLanguage("zh");
    useAppStore.getState().setSelectedChildId("xiaoyu");
    render(resolveRoute("#/child/xiaoyu/report"));

    expect(await screen.findByText("活动报告")).toBeInTheDocument();
    expect(await screen.findByText("写草稿")).toBeInTheDocument();
  });
});
