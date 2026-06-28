import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { resolveRoute } from "../app/routes";
import { useAppStore } from "../store/useAppStore";

describe("route smoke tests", () => {
  it("renders the report method route", () => {
    useAppStore.getState().setLanguage("zh");
    useAppStore.getState().setSelectedChildId("xiaoyu");
    render(resolveRoute("#/child/xiaoyu/report-method"));

    expect(screen.getByText("报告怎么来的")).toBeInTheDocument();
  });
});
