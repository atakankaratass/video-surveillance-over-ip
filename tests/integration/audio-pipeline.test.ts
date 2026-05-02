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
    audioDevice: "0",
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

describe("audio startup pipeline", () => {
  it("builds an audio-enabled startup plan with AAC output", () => {
    const plan = createStartupPlan(config, "/workspace/project", {
      audio: true,
    });

    expect(plan.audioEnabled).toBe(true);
    expect(plan.ffmpeg.command).toBe("ffmpeg");
    expect(plan.ffmpeg.args).toContain("-c:a");
    expect(plan.ffmpeg.args).toContain("aac");
    expect(plan.ffmpeg.args).toContain("0:0");
    expect(plan.ffmpeg.manifestPath).toBe("./output/dash/live-audio.mpd");
    expect(plan.manifestUrl).toBe("http://127.0.0.1:8080/dash/live-audio.mpd");
  });
});
