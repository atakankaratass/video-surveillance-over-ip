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

describe("createStartupPlan", () => {
  it("returns nginx and ffmpeg launch commands", () => {
    const plan = createStartupPlan(config, "/workspace/project");

    expect(plan.ffmpeg.command).toBe("ffmpeg");
    expect(plan.nginx.command).toBe("nginx");
    expect(plan.nginx.args).toEqual([
      "-c",
      "/workspace/project/configs/nginx/generated.conf",
      "-p",
      "/workspace/project",
    ]);
  });

  it("reports the local playback URL from the config", () => {
    const plan = createStartupPlan(config, "/workspace/project");

    expect(plan.playerUrl).toBe("http://127.0.0.1:8080");
    expect(plan.manifestUrl).toBe("http://127.0.0.1:8080/dash/live.mpd");
  });
});
