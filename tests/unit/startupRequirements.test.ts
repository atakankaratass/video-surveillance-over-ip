import { describe, expect, it } from "vitest";

import {
  evaluateStartupRequirements,
  formatStartupRequirementsReport,
} from "../../src/server/startupRequirements";

describe("startupRequirements", () => {
  it("reports ready when required commands are present", () => {
    const result = evaluateStartupRequirements({
      ffmpegAvailable: true,
      nginxAvailable: true,
    });

    expect(result.ok).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("reports missing binaries when commands are unavailable", () => {
    const result = evaluateStartupRequirements({
      ffmpegAvailable: false,
      nginxAvailable: false,
    });

    expect(result.ok).toBe(false);
    expect(result.missing).toEqual(["ffmpeg", "nginx"]);
  });

  it("formats an actionable startup requirements report", () => {
    const report = formatStartupRequirementsReport({
      ok: false,
      missing: ["nginx"],
    });

    expect(report).toContain("Startup requirements: NOT READY");
    expect(report).toContain("Missing commands: nginx");
    expect(report).toContain(
      "Install the missing commands before starting live services.",
    );
  });
});
