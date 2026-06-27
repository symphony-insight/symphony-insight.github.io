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
      title: "愿不愿意参与",
      titleEn: "Willingness to join",
      score: 4,
      summary: "看孩子是不是愿意进入活动、停留一会儿，并在需要时继续尝试。"
    });
    expect(dimensions[0].criteria[0]).toBe("孩子能不能主动开始或继续活动");
    expect(dimensions[0].scale[0]).toContain("明显不舒服");
    expect(dimensions[8].title).toBe("本周目标有没有进展");
    expect(dimensions[8].summary).toContain("只和自己的小目标比较");
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
