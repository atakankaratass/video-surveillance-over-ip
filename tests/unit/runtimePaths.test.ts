import { describe, expect, it } from "vitest";

import {
  getRuntimeDirectories,
  resolveProjectPath,
} from "../../src/server/runtimePaths";
import type { AppConfig } from "../../src/server/config";

const config: AppConfig = {
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
};

describe("runtimePaths", () => {
  it("resolves project-relative paths against the repo root", () => {
    expect(resolveProjectPath("/workspace/project", "./output/dash")).toBe(
      "/workspace/project/output/dash",
    );
  });

  it("returns the runtime directories that must exist before startup", () => {
    expect(getRuntimeDirectories(config, "/workspace/project")).toEqual([
      "/workspace/project/output",
      "/workspace/project/output/dash",
    ]);
  });
});
