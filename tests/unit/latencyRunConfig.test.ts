import { describe, expect, it } from "vitest";

import type { AppConfig } from "../../src/server/config";
import { createLatencyRunConfig } from "../../src/server/latency/runConfig";

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

describe("createLatencyRunConfig", () => {
  it("overrides segment duration and port for an isolated latency run", () => {
    const derived = createLatencyRunConfig(config, 2, 8092);

    expect(derived.streaming.segmentDurationSeconds).toBe(2);
    expect(derived.server.port).toBe(8092);
    expect(derived.paths.dashRoot).toBe("./output/dash-2s");
  });

  it("preserves unrelated config settings", () => {
    const derived = createLatencyRunConfig(config, 6, 8096);

    expect(derived.capture.inputSource).toBe("0:none");
    expect(derived.capture.pixelFormat).toBe("uyvy422");
    expect(derived.motion.enabled).toBe(false);
  });
});
