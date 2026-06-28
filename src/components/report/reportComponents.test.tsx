import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { reportDraft } from "../../data/mockData";
import { ReportSafetyNotice } from "./ReportSafetyNotice";
import { ReportSourceSummary } from "./ReportSourceSummary";
import { ReportWorkflowSteps } from "./ReportWorkflowSteps";

describe("report workflow components", () => {
  it("renders the report workflow steps in teacher-facing language", () => {
    render(<ReportWorkflowSteps report={reportDraft} isGenerating={false} language="zh" />);

    expect(screen.getByText("整理草稿")).toBeInTheDocument();
    expect(screen.getByText("检查表述")).toBeInTheDocument();
    expect(screen.getByText("老师确认")).toBeInTheDocument();
    expect(screen.getByText("导出摘要")).toBeInTheDocument();
  });

  it("keeps the expression check step current when safety review needs edits", () => {
    const reportNeedingEdits = {
      ...reportDraft,
      safetyCheck: {
        ...reportDraft.safetyCheck,
        displayStatus: "needs_edit" as const
      }
    };

    render(<ReportWorkflowSteps report={reportNeedingEdits} isGenerating={false} language="zh" />);

    expect(screen.getByText("检查表述").closest('[aria-current="step"]')).toBeInTheDocument();
  });

  it("renders report sources and links to the scoring guide", () => {
    render(<ReportSourceSummary report={reportDraft} childId="xiaoyu" language="zh" />);

    expect(screen.getByText("草稿来自哪里")).toBeInTheDocument();
    expect(screen.getByText("8 次活动记录")).toBeInTheDocument();
    expect(screen.getByText("9 项观察问题")).toBeInTheDocument();
    expect(screen.getByText("6 个观察方向")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /查看评分说明/ })).toHaveAttribute("href", "#/child/xiaoyu/rubrics");
  });

  it("renders safety check status without technical wording", () => {
    render(<ReportSafetyNotice safetyCheck={reportDraft.safetyCheck} language="zh" />);

    expect(screen.getByText("表述检查通过")).toBeInTheDocument();
    expect(screen.getByText("没有发现不适合直接使用的表述。")).toBeInTheDocument();
  });

  it("renders english copy when language is en", () => {
    render(
      <div>
        <ReportWorkflowSteps report={reportDraft} isGenerating={false} language="en" />
        <ReportSourceSummary report={reportDraft} childId="xiaoyu" language="en" />
        <ReportSafetyNotice safetyCheck={reportDraft.safetyCheck} language="en" />
      </div>
    );

    expect(screen.getByText("Draft report")).toBeInTheDocument();
    expect(screen.getByText("Report sources")).toBeInTheDocument();
    expect(screen.getByText("Expression check passed")).toBeInTheDocument();
    expect(screen.getByText("No wording was found that should be held back from parent-facing use.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View rubric guide/ })).toHaveAttribute("href", "#/child/xiaoyu/rubrics");
  });
});
