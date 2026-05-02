import { describe, expect, it } from "vitest";

import type { AppConfig } from "../../src/server/config";
import { createStartupPlan } from "../../src/server/startupPlan";

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

describe("abr startup pipeline", () => {
  it("builds an abr-enabled startup plan with multi-representation output", () => {
    const plan = createStartupPlan(config, "/workspace/project", {
      abr: true,
    });

    expect(plan.abrEnabled).toBe(true);
    expect(plan.audioEnabled).toBe(false);
    expect(plan.ffmpeg.command).toBe("ffmpeg");
    expect(plan.ffmpeg.args).toContain("-filter_complex");
    expect(plan.ffmpeg.manifestPath).toBe("./output/dash/live-abr.mpd");
    expect(plan.manifestUrl).toBe("http://127.0.0.1:8080/dash/live-abr.mpd");
  });

  it("rejects combination of audio and abr", () => {
    expect(() =>
      createStartupPlan(config, "/workspace/project", {
        abr: true,
        audio: true,
      }),
    ).toThrowError("Cannot enable both audio and abr modes at the same time.");
  });
});
