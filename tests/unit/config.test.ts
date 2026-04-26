import { describe, expect, it } from "vitest";

import { parseAppConfig } from "../../src/server/config";

describe("parseAppConfig", () => {
  it("parses a valid config object", () => {
    const config = parseAppConfig({
      paths: {
        outputRoot: "./output",
        dashRoot: "./output/dash",
      },
      capture: {
        inputFormat: "avfoundation",
        inputSource: "0:none",
        frameRate: 30,
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
    });

    expect(config.streaming.segmentDurationSeconds).toBe(4);
    expect(config.server.port).toBe(8080);
    expect(config.capture.inputSource).toBe("0:none");
    expect(config.capture.audioDevice).toBeNull();
  });

  it("rejects an empty input source", () => {
    expect(() =>
      parseAppConfig({
        paths: {
          outputRoot: "./output",
          dashRoot: "./output/dash",
        },
        capture: {
          inputFormat: "avfoundation",
          inputSource: "",
          frameRate: 30,
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
      }),
    ).toThrowError("capture.inputSource must be a non-empty string");
  });

  it("rejects unsupported segment durations", () => {
    expect(() =>
      parseAppConfig({
        paths: {
          outputRoot: "./output",
          dashRoot: "./output/dash",
        },
        capture: {
          inputFormat: "avfoundation",
          inputSource: "0:none",
          frameRate: 30,
          audioDevice: null,
        },
        streaming: {
          segmentDurationSeconds: 3,
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
      }),
    ).toThrowError("streaming.segmentDurationSeconds must be one of: 2, 4, 6");
  });

  it("rejects a hardcoded absolute output path", () => {
    expect(() =>
      parseAppConfig({
        paths: {
          outputRoot: "/tmp/output",
          dashRoot: "./output/dash",
        },
        capture: {
          inputFormat: "avfoundation",
          inputSource: "0:none",
          frameRate: 30,
          audioDevice: null,
        },
        streaming: {
          segmentDurationSeconds: 2,
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
      }),
    ).toThrowError("paths.outputRoot must be relative, not absolute");
  });
});
