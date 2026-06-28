import { describe, expect, it } from "vitest";
import { evaluationDimensions } from "../data/mockData";
import { assessmentDomains, getDomainForRubric } from "./assessmentDomains";

describe("assessmentDomains", () => {
  it("maps every covered rubric to exactly one domain, with no duplicates", () => {
    const allMapped = assessmentDomains.flatMap((domain) => domain.rubricIds);
    const unique = new Set(allMapped);
    expect(unique.size).toBe(allMapped.length);
  });

  it("covers all 9 evaluation dimensions across the covered domains", () => {
    const mapped = new Set(assessmentDomains.flatMap((domain) => domain.rubricIds));
    for (const dimension of evaluationDimensions) {
      expect(mapped.has(dimension.id)).toBe(true);
    }
    expect(mapped.size).toBe(evaluationDimensions.length);
  });

  it("keeps the RRB / behavior domain as an honest gap (not covered, no rubrics)", () => {
    const behavior = assessmentDomains.find((domain) => domain.id === "behavior");
    expect(behavior?.covered).toBe(false);
    expect(behavior?.rubricIds).toEqual([]);
  });

  it("resolves a domain for each rubric id", () => {
    for (const dimension of evaluationDimensions) {
      expect(getDomainForRubric(dimension.id)).toBeDefined();
    }
  });

  it("never labels the attention domain as IQ / diagnosis", () => {
    const text = assessmentDomains.map((d) => `${d.nameZh}${d.noteZh}`).join("");
    expect(text).not.toMatch(/IQ|智商|诊断|疗效/);
  });
});
