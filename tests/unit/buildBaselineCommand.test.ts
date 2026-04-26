import { describe, expect, it } from "vitest";

import { buildBaselineCommand } from "../../src/server/ffmpeg/buildBaselineCommand";
import type { AppConfig } from "../../src/server/config";

const config: AppConfig = {
  paths: {
    outputRoot: "./output",
    dashRoot: "./output/dash",
  },
  capture: {
    videoDevice: "default-camera",
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

describe("buildBaselineCommand", () => {
  it("builds an ffmpeg command for h264 live dash packaging", () => {
    const result = buildBaselineCommand(config);

    expect(result.command).toBe("ffmpeg");
    expect(result.args).toContain("-c:v");
    expect(result.args).toContain("libx264");
    expect(result.args).toContain("-f");
    expect(result.args).toContain("dash");
    expect(result.args).toContain("default-camera");
    expect(result.manifestPath).toBe("./output/dash/live.mpd");
  });

  it("uses the configured segment duration and dvr window size", () => {
    const result = buildBaselineCommand(config);

    const segmentDurationIndex = result.args.indexOf("-seg_duration");
    const windowSizeIndex = result.args.indexOf("-window_size");

    expect(result.args[segmentDurationIndex + 1]).toBe("4");
    expect(result.args[windowSizeIndex + 1]).toBe("30");
  });

  it("omits audio input flags in the baseline no-audio mode", () => {
    const result = buildBaselineCommand(config);

    expect(result.args).not.toContain("-c:a");
    expect(result.args).not.toContain("aac");
  });
});
