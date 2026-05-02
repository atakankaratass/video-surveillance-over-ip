import { describe, expect, it } from "vitest";

import type { AppConfig } from "../../src/server/config";
import { buildAudioCommand } from "../../src/server/ffmpeg/buildAudioCommand";

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

describe("buildAudioCommand", () => {
  it("builds an ffmpeg command with AAC audio enabled", () => {
    const result = buildAudioCommand(config);

    expect(result.command).toBe("ffmpeg");
    expect(result.args).toContain("-i");
    expect(result.args).toContain("0:0");
    expect(result.args).toContain("-c:v");
    expect(result.args).toContain("libx264");
    expect(result.args).toContain("-c:a");
    expect(result.args).toContain("aac");
    expect(result.args).toContain("-seg_duration");
    expect(result.args).toContain("4");
    expect(result.manifestPath).toBe("./output/dash/live-audio.mpd");
  });

  it("fails when audio device is not configured", () => {
    expect(() =>
      buildAudioCommand({
        ...config,
        capture: {
          ...config.capture,
          audioDevice: null,
        },
      }),
    ).toThrowError("capture.audioDevice is required for audio capture.");
  });
});
