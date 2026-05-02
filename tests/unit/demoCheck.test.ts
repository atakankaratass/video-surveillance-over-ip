import { describe, expect, it } from "vitest";

import type { AppConfig } from "../../src/server/config";
import {
  evaluateDemoReadiness,
  formatDemoReadinessReport,
} from "../../src/server/demoCheck";

const config: AppConfig = {
  paths: {
    outputRoot: "./output",
    dashRoot: "./output/dash",
  },
  capture: {
    inputFormat: "avfoundation",
    inputSource: "0:none",
    frameRate: 30,
    pixelFormat: "uyvy422",
    videoSize: "1280x720",
    audioDevice: null,
  },
  streaming: {
    segmentDurationSeconds: 4,
    dvrWindowSeconds: 120,
  },
  server: {
    host: "127.0.0.1",
    port: 8080,
  },
  motion: {
    enabled: false,
    threshold: 0.2,
  },
  thumbnails: {
    intervalSeconds: 10,
  },
};

describe("demoCheck", () => {
  it("marks demo readiness as passing when env and artifacts are ready", () => {
    const result = evaluateDemoReadiness(config, {
      environmentOk: true,
      hasGeneratedNginxConfig: true,
      hasManifest: true,
      hasDashDirectory: true,
      availableVideoDevices: [{ id: "0", name: "FaceTime HD Camera" }],
    });

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("reports all blocking issues for a not-ready demo environment", () => {
    const result = evaluateDemoReadiness(config, {
      environmentOk: false,
      hasGeneratedNginxConfig: false,
      hasManifest: false,
      hasDashDirectory: false,
      availableVideoDevices: [],
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual([
      "Environment validation is failing.",
      "Generated NGINX config is missing.",
      "DASH output directory is missing.",
      "Live DASH manifest is missing.",
      "No video capture devices were discovered.",
    ]);
  });

  it("formats a readable readiness report", () => {
    const report = formatDemoReadinessReport({
      ok: false,
      issues: ["Environment validation is failing."],
    });

    expect(report).toContain("Preflight readiness: NOT READY");
    expect(report).toContain("- Environment validation is failing.");
  });

  it("describes demo-check as a preflight readiness check", () => {
    const report = formatDemoReadinessReport({
      ok: true,
      issues: [],
    });

    expect(report).toContain("Preflight readiness: READY");
    expect(report).not.toContain("Full live demo proof");
  });
});
