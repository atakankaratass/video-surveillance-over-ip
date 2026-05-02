import { describe, expect, it } from "vitest";

import type { AppConfig } from "../../src/server/config";
import { buildAbrCommand } from "../../src/server/ffmpeg/buildAbrCommand";

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
    port: 8090,
  },
  motion: {
    enabled: false,
    threshold: 0.2,
  },
  thumbnails: {
    intervalSeconds: 10,
  },
};

describe("buildAbrCommand", () => {
  it("builds an ffmpeg command with 3 video representations", () => {
    const result = buildAbrCommand(config);

    expect(result.command).toBe("ffmpeg");
    expect(result.args).toContain("-i");
    expect(result.args).toContain("0:none");
    expect(result.args).toContain("-filter_complex");
    expect(result.args).toContain("-map");
    expect(result.args).toContain("[v1out]");
    expect(result.args).toContain("[v2out]");
    expect(result.args).toContain("[v3out]");
    expect(result.args).toContain("-c:v:0");
    expect(result.args).toContain("-b:v:0");
    expect(result.args).toContain("-c:v:1");
    expect(result.args).toContain("-b:v:1");
    expect(result.args).toContain("-c:v:2");
    expect(result.args).toContain("-b:v:2");
    expect(result.args).toContain("-seg_duration");
    expect(result.args).toContain("4");
    expect(result.args).toContain("-adaptation_sets");
    expect(result.manifestPath).toBe("./output/dash/live-abr.mpd");
  });

  it("uses aspect-ratio-aligned abr ladder resolutions", () => {
    const result = buildAbrCommand(config);
    const filterComplexIndex = result.args.indexOf("-filter_complex");
    const filterComplex = result.args[filterComplexIndex + 1];

    expect(filterComplex).toContain("scale=640:360");
    expect(filterComplex).toContain("scale=960:540");
    expect(filterComplex).toContain("scale=1280:720");
  });
});
