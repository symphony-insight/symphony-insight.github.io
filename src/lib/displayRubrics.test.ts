import { describe, expect, it } from "vitest";
import { evaluationDimensions } from "../data/mockData";
import { filterDisplayRubrics, getDisplayRubrics } from "./displayRubrics";

const forbiddenDisplayTerms = ["rubric", "dimension", "confidence", "claim", "trace", "诊断", "疗效", "康复有效", "恢复正常"];

describe("display rubrics", () => {
  it("maps technical evaluation data into plain Chinese score labels", () => {
    const rubrics = getDisplayRubrics(evaluationDimensions, "zh");

    expect(rubrics).toHaveLength(9);
    expect(rubrics[0]).toMatchObject({
      title: "愿不愿意参加",
      scoreLabel: "4/5",
      statusLabel: "比较稳",
      sourceLabel: "看到的依据",
      tone: "stable"
    });
    expect(rubrics[0].plainExplanation).toContain("愿不愿意开始活动");
    expect(rubrics[0].primaryObservable).toContain("主动开始");
    expect(rubrics[0].guide).toContain("3 分：有人提醒时能做到一部分");
  });

  it("keeps score labels understandable across the 1 to 5 range", () => {
    const [base] = evaluationDimensions;
    const rubrics = getDisplayRubrics(
      [
        { ...base, id: "join", score: 1 },
        { ...base, id: "choice", score: 2 },
        { ...base, id: "focus", score: 3 },
        { ...base, id: "respond", score: 4 },
        { ...base, id: "create", score: 5 }
      ],
      "zh"
    );

    expect(rubrics.map((item) => item.statusLabel)).toEqual(["暂时还难", "需要多一点帮助", "需要一点提醒", "比较稳", "很稳"]);
  });

  it("filters by title, explanation, and observable evidence", () => {
    const rubrics = getDisplayRubrics(evaluationDimensions, "zh");

    expect(filterDisplayRubrics(rubrics, "参加").map((item) => item.title)).toContain("愿不愿意参加");
    expect(filterDisplayRubrics(rubrics, "触屏").map((item) => item.title)).toEqual(["操作方式顺不顺手"]);
    expect(filterDisplayRubrics(rubrics, "没有结果")).toEqual([]);
  });

  it("does not expose internal evaluation jargon in display data", () => {
    const serialized = JSON.stringify(getDisplayRubrics(evaluationDimensions, "zh"));

    for (const phrase of forbiddenDisplayTerms) {
      expect(serialized).not.toContain(phrase);
    }
  });
});
