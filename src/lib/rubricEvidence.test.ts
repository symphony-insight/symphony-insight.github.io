import { describe, expect, it } from "vitest";
import { sessions } from "../data/mockData";
import { getRubricEvidence } from "./rubricEvidence";

describe("rubricEvidence", () => {
  it("computes join evidence from real session metrics (4 -> 30)", () => {
    const evidence = getRubricEvidence("join", sessions, "zh");
    const selfStarted = evidence.metricChanges.find((change) => change.label === "主动参加");
    expect(selfStarted?.from).toBe("4");
    expect(selfStarted?.to).toBe("30");
    expect(selfStarted?.trend).toBe("up");
  });

  it("treats lower recovery time as a positive trend", () => {
    const evidence = getRubricEvidence("recover", sessions, "zh");
    const recovery = evidence.metricChanges.find((change) => change.label === "回到活动用时");
    // first session 180s -> last 76s, lower is better => up
    expect(recovery?.from).toBe("180s");
    expect(recovery?.to).toBe("76s");
    expect(recovery?.trend).toBe("up");
  });

  it("only surfaces evidence sessions that exist", () => {
    const evidence = getRubricEvidence("join", sessions, "zh");
    expect(evidence.evidenceSessions).toEqual([2, 4, 5, 8]);
  });

  it("marks recover and setting as awaiting teacher confirmation", () => {
    expect(getRubricEvidence("recover", sessions, "zh").teacherConfirmed).toBe(false);
    expect(getRubricEvidence("setting", sessions, "zh").teacherConfirmed).toBe(false);
    expect(getRubricEvidence("join", sessions, "zh").teacherConfirmed).toBe(true);
  });

  it("exposes a plain-language framework label, never a dataset name", () => {
    const evidence = getRubricEvidence("respond", sessions, "zh");
    expect(evidence.frameworkLabel).toBe("共同注意与轮流");
    expect(evidence.frameworkLabel).not.toMatch(/DREAM|DAiSEE|CAFE/);
  });
});
