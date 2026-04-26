import { describe, expect, it, vi } from "vitest";

import { createProcessManager } from "../../src/server/ffmpeg/processManager";

describe("createProcessManager", () => {
  it("starts and tracks a named process", async () => {
    const kill = vi.fn();
    const manager = createProcessManager({
      spawnProcess: async () => ({ pid: 101, kill }),
    });

    const processInfo = await manager.start("ffmpeg", "ffmpeg", ["-version"]);

    expect(processInfo.pid).toBe(101);
    expect(manager.get("ffmpeg")?.pid).toBe(101);
  });

  it("rejects starting the same named process twice", async () => {
    const manager = createProcessManager({
      spawnProcess: async () => ({ pid: 101, kill: vi.fn() }),
    });

    await manager.start("ffmpeg", "ffmpeg", ["-version"]);

    await expect(
      manager.start("ffmpeg", "ffmpeg", ["-version"]),
    ).rejects.toThrow("Process already running: ffmpeg");
  });

  it("stops a tracked process and removes it from the registry", async () => {
    const kill = vi.fn();
    const manager = createProcessManager({
      spawnProcess: async () => ({ pid: 101, kill }),
    });

    await manager.start("ffmpeg", "ffmpeg", ["-version"]);
    await manager.stop("ffmpeg");

    expect(kill).toHaveBeenCalledWith("SIGTERM");
    expect(manager.get("ffmpeg")).toBeUndefined();
  });
});
