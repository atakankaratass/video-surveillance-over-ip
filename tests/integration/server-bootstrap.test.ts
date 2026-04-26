import { describe, expect, it } from "vitest";

import type { AppConfig } from "../../src/server/config";
import { bootstrapServer } from "../../src/server/server";

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

describe("bootstrapServer", () => {
  it("builds ffmpeg and nginx startup artifacts from the shared config", async () => {
    const result = await bootstrapServer(config, "/workspace/project", {
      ensureDirectory: async () => undefined,
      writeTextFile: async () => undefined,
    });

    expect(result.manifestPath).toBe("./output/dash/live.mpd");
    expect(result.nginxConfigPath).toBe("configs/nginx/generated.conf");
    expect(result.ffmpeg.command).toBe("ffmpeg");
    expect(result.nginxConfig).toContain("listen 8080;");
  });

  it("writes the generated nginx config to the expected path", async () => {
    const writes: Array<{ path: string; content: string }> = [];
    const directories: string[] = [];

    await bootstrapServer(config, "/workspace/project", {
      ensureDirectory: async (path) => {
        directories.push(path);
      },
      writeTextFile: async (path, content) => {
        writes.push({ path, content });
      },
    });

    expect(directories).toEqual([
      "/workspace/project/output",
      "/workspace/project/output/dash",
    ]);
    expect(writes).toHaveLength(1);
    expect(writes[0]?.path).toBe(
      "/workspace/project/configs/nginx/generated.conf",
    );
    expect(writes[0]?.content).toContain("server_name 127.0.0.1;");
  });
});
