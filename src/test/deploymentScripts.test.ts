import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const scripts = [
  "scripts/deploy-remote-server.sh",
  "scripts/configure-cloudflared-symphony.sh"
];

describe("deployment scripts", () => {
  it("keeps the remote deployment scripts present and syntax-checkable", () => {
    for (const script of scripts) {
      expect(existsSync(script), `${script} should exist`).toBe(true);
      execFileSync("bash", ["-n", script], { stdio: "pipe" });
    }
  });

  it("targets the configured server path, domain, and local backend port", () => {
    const combined = scripts.map((script) => readFileSync(script, "utf-8")).join("\n");

    expect(combined).toContain("/home/data/xuyijie/symphony-insight");
    expect(combined).toContain("symphony.yjx.me");
    expect(combined).toContain("construction-rag.yjx.me");
    expect(combined).toContain("127.0.0.1:8090");
    expect(combined).not.toMatch(/SYMPHONY_LLM_API_KEY=.*(sk-|deepseek|replace_with_your_api_key)/);
  });
});
