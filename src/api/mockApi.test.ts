import { describe, expect, it } from "vitest";
import { mockApi } from "./mockApi";

const forbiddenPhrases = ["诊断", "疗效", "病情好转", "病情恶化", "康复有效", "恢复正常"];

function expectSafeCopy(text: string) {
  for (const phrase of forbiddenPhrases) {
    expect(text).not.toContain(phrase);
  }
}

describe("mockApi", () => {
  it("returns multiple selectable children", async () => {
    const children = await mockApi.getChildren();

    expect(children.map((item) => item.id)).toEqual(["xiaoyu", "lele", "anan"]);
    expect(children[1].displayName).toBe("乐乐");
    expect(children[2].displayNameEn).toBe("Anan");
  });

  it("returns Xiaoyu with an 8-session observation history", async () => {
    const child = await mockApi.getChild("xiaoyu");
    const sessions = await mockApi.getSessions("xiaoyu");

    expect(child.displayName).toBe("小宇");
    expect(child.sessionCount).toBe(8);
    expect(sessions).toHaveLength(8);
    expect(sessions[5].story).toContain("高亮动画");
    expect(sessions[7].completedPhase).toBe("reveal");
  });

  it("returns a report draft for each child by child id", async () => {
    const report = await mockApi.getReportDraftByChild("lele");

    expect(report.childId).toBe("lele");
    expect(report.id).toBe("report-lele-8");
  });

  it("returns report generation metadata and traceable sources", async () => {
    await mockApi.resetReviewState();
    const report = await mockApi.getReportDraftByChild("xiaoyu");

    expect(report.generation).toMatchObject({
      id: "generation-xiaoyu-8",
      status: "needs_teacher_review",
      sourceSessionCount: 8,
      sourceRubricCount: 9,
      sourceDomainCount: 6,
      modelLabel: "报告整理助手",
      modelLabelEn: "Report assistant"
    });
    expect(report.generation.promptVersion).toBe("report-draft-v1-2026-06");
    expect(report.safetyCheck).toMatchObject({
      containsMedicalClaim: false,
      flaggedPhrases: [],
      displayStatus: "passed",
      plainSummary: "没有发现不适合直接使用的表述。",
      plainSummaryEn: "No wording was found that should be held back from parent-facing use."
    });
    expect(report.evidenceTrace.sessionIds).toContain("session-8");
    expect(report.evidenceTrace.rubricIds).toContain("join");
    expect(report.evidenceTrace.referenceIds).toContain("kim-2008");
  });

  it("generates a fresh report draft and records a system audit entry", async () => {
    await mockApi.resetReviewState();
    const generated = await mockApi.generateReportDraft("xiaoyu");
    const auditLogs = await mockApi.getAuditLogs("xiaoyu");

    expect(generated.childId).toBe("xiaoyu");
    expect(generated.generation.status).toBe("draft_ready");
    expect(generated.generation.generatedAt).not.toBe("2026-06-27T10:10:00+08:00");
    expect(auditLogs[0]).toMatchObject({
      actor: "报告整理助手",
      actorEn: "Report assistant",
      action: "report.generated",
      targetType: "report",
      targetId: "report-xiaoyu-8",
      summary: "系统整理了一版报告草稿，等老师确认。",
      summaryEn: "The system prepared a report draft for teacher review."
    });
  });

  it("rejects report draft generation for an unknown child", async () => {
    await expect(mockApi.generateReportDraft("missing-child")).rejects.toThrow("Unknown child: missing-child");
  });

  it("returns nine plain-language child observation rubrics with 1-to-5 scores", async () => {
    const dimensions = await mockApi.getEvaluationDimensions("xiaoyu");

    expect(dimensions).toHaveLength(9);
    expect(dimensions.map((dimension) => dimension.id)).toEqual([
      "join",
      "choice",
      "focus",
      "respond",
      "create",
      "recover",
      "access",
      "setting",
      "goal"
    ]);
    expect(dimensions[0]).toMatchObject({
      title: "愿不愿意参加",
      titleEn: "Willingness to join",
      score: 4,
      summary: "看孩子愿不愿意开始活动，能不能停留一会儿，暂停后还愿不愿意再试。"
    });
    expect(dimensions[0].criteria[0]).toBe("孩子会不会主动开始或继续");
    expect(dimensions[0].scale[0]).toContain("明显不舒服");
    expect(dimensions[8].title).toBe("这周小目标有没有往前走");
    expect(dimensions[8].summary).toContain("只和自己比");
  });

  it("keeps insight and report copy inside observation-only language", async () => {
    const insights = await mockApi.getInsights("xiaoyu");
    const report = await mockApi.getReportDraft("report-xiaoyu-8");

    for (const insight of insights) {
      expectSafeCopy(`${insight.title} ${insight.statement}`);
      expect(["observation", "trend", "requires_professional_review"]).toContain(insight.claimLevel);
    }

    expectSafeCopy(Object.values(report.professionalDraft).flat().join(" "));
    expect(report.safetyCheck.containsMedicalClaim).toBe(false);
  });

  it("records teacher approval as an audit log entry", async () => {
    await mockApi.resetReviewState();
    const approved = await mockApi.updateReportStatus("report-xiaoyu-8", "approved", "陈老师");
    const auditLogs = await mockApi.getAuditLogs("xiaoyu");

    expect(approved.status).toBe("approved");
    expect(auditLogs[0]).toMatchObject({
      actor: "陈老师",
      action: "report.approved",
      targetId: "report-xiaoyu-8"
    });
  });
});
