import { describe, expect, it } from "vitest";

import { validateEnvironment } from "../../src/server/validateEnvironment";

describe("validateEnvironment", () => {
  it("returns no issues when dependencies and paths are valid", async () => {
    const result = await validateEnvironment(
      {
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
      },
      {
        commandExists: async () => true,
        directoryWritable: async () => true,
        portAvailable: async () => true,
      },
    );

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("reports missing ffmpeg and nginx dependencies", async () => {
    const result = await validateEnvironment(
      {
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
      },
      {
        commandExists: async () => false,
        directoryWritable: async () => true,
        portAvailable: async () => true,
      },
    );

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual([
      "FFmpeg is not available on PATH.",
      "NGINX is not available on PATH.",
    ]);
  });

  it("reports unwritable output directories", async () => {
    const result = await validateEnvironment(
      {
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
      },
      {
        commandExists: async () => true,
        directoryWritable: async (path) => path !== "./output/dash",
        portAvailable: async () => true,
      },
    );

    expect(result.ok).toBe(false);
    expect(result.issues).toContain("Path is not writable: ./output/dash");
  });

  it("reports an unavailable configured server port", async () => {
    const result = await validateEnvironment(
      {
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
      },
      {
        commandExists: async () => true,
        directoryWritable: async () => true,
        portAvailable: async () => false,
      },
    );

    expect(result.ok).toBe(false);
    expect(result.issues).toContain(
      "Configured server port is unavailable: 8080",
    );
  });
});
