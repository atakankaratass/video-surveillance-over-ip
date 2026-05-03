import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("startThumbnailRefreshLoop", () => {
  it("waits until 60000ms before the first thumbnail generation", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});

    const generate = vi.fn().mockResolvedValue(undefined);
    const module = (await import("../../scripts/dev")) as {
      startThumbnailRefreshLoop: (options: {
        generate: () => Promise<void>;
        initialDelayMs: number;
        refreshIntervalMs: number;
      }) => { stop: () => void };
    };

    const loop = module.startThumbnailRefreshLoop({
      generate,
      initialDelayMs: 60000,
      refreshIntervalMs: 60000,
    });

    await vi.advanceTimersByTimeAsync(59999);
    expect(generate).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(generate).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(59999);
    expect(generate).toHaveBeenCalledTimes(1);

    loop.stop();
  });

  it("regenerates thumbnails every 10000ms after the first run", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});

    const generate = vi.fn().mockResolvedValue(undefined);
    const module = (await import("../../scripts/dev")) as {
      startThumbnailRefreshLoop: (options: {
        generate: () => Promise<void>;
        initialDelayMs: number;
        refreshIntervalMs: number;
      }) => { stop: () => void };
    };

    const loop = module.startThumbnailRefreshLoop({
      generate,
      initialDelayMs: 60000,
      refreshIntervalMs: 10000,
    });

    await vi.advanceTimersByTimeAsync(60000);
    expect(generate).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(9999);
    expect(generate).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    expect(generate).toHaveBeenCalledTimes(2);

    loop.stop();
  });

  it("cancels the active wait when stopped", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});

    const generate = vi.fn().mockResolvedValue(undefined);
    const module = (await import("../../scripts/dev")) as {
      startThumbnailRefreshLoop: (options: {
        generate: () => Promise<void>;
        initialDelayMs: number;
        refreshIntervalMs: number;
      }) => { stop: () => void };
    };

    const loop = module.startThumbnailRefreshLoop({
      generate,
      initialDelayMs: 10,
      refreshIntervalMs: 20,
    });

    expect(vi.getTimerCount()).toBe(1);

    loop.stop();

    expect(vi.getTimerCount()).toBe(0);
  });

  it("logs errors and retries on the next 10-second interval", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});
    const log = vi.fn();

    const generate = vi
      .fn<() => Promise<void>>()
      .mockRejectedValueOnce(new Error("thumbnail failed"))
      .mockResolvedValueOnce(undefined);
    const module = (await import("../../scripts/dev")) as {
      startThumbnailRefreshLoop: (options: {
        generate: () => Promise<void>;
        initialDelayMs: number;
        refreshIntervalMs: number;
        log: (message: string) => void;
      }) => { stop: () => void };
    };

    const loop = module.startThumbnailRefreshLoop({
      generate,
      initialDelayMs: 60000,
      refreshIntervalMs: 10000,
      log,
    });

    await vi.advanceTimersByTimeAsync(60000);

    expect(generate).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining("thumbnail failed"),
    );

    await vi.advanceTimersByTimeAsync(10000);

    expect(generate).toHaveBeenCalledTimes(2);

    loop.stop();
  });

  it("stops scheduling new generations after stop is called", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});

    const generate = vi.fn().mockResolvedValue(undefined);
    const module = (await import("../../scripts/dev")) as {
      startThumbnailRefreshLoop: (options: {
        generate: () => Promise<void>;
        initialDelayMs: number;
        refreshIntervalMs: number;
      }) => { stop: () => void };
    };

    const loop = module.startThumbnailRefreshLoop({
      generate,
      initialDelayMs: 60000,
      refreshIntervalMs: 10000,
    });

    await vi.advanceTimersByTimeAsync(60000);
    expect(generate).toHaveBeenCalledTimes(1);

    loop.stop();

    await vi.advanceTimersByTimeAsync(30000);
    expect(generate).toHaveBeenCalledTimes(1);
  });

  it("does not schedule another refresh after stop during an in-flight generation", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});

    let resolveGenerate: (() => void) | null = null;
    const generate = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveGenerate = resolve;
        }),
    );
    const module = (await import("../../scripts/dev")) as {
      startThumbnailRefreshLoop: (options: {
        generate: () => Promise<void>;
        initialDelayMs: number;
        refreshIntervalMs: number;
      }) => { stop: () => void };
    };

    const loop = module.startThumbnailRefreshLoop({
      generate,
      initialDelayMs: 10,
      refreshIntervalMs: 10000,
    });

    await vi.advanceTimersByTimeAsync(10);
    expect(generate).toHaveBeenCalledTimes(1);

    loop.stop();
    expect(vi.getTimerCount()).toBe(0);

    if (!resolveGenerate) {
      throw new Error("Expected in-flight generation to be pending.");
    }

    const completeGenerate = resolveGenerate as () => void;
    completeGenerate();
    await Promise.resolve();

    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(10000);
    expect(generate).toHaveBeenCalledTimes(1);
  });
});
