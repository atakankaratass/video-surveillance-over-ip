# Thumbnail Auto Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `make startup-all` sonrasinda thumbnail uretimini 60 saniye sonra otomatik baslatip yayin surerken her 10 saniyede bir yeniden uretmek.

**Architecture:** Mevcut `scripts/dev.ts` icindeki tek seferlik thumbnail uretimi, process icinde calisan bir background loop'a donusturulur. Loop FFmpeg basladiktan sonra ilk 60 saniyelik beklemeyi uygular, sonra 10 saniyelik periyotlarla `generateThumbnailArtifacts` cagirir, hata olursa loglayip sonraki tura devam eder ve shutdown sinyalinde durur.

**Tech Stack:** TypeScript, Node.js timers, Vitest, existing startup/dev script flow.

---

## File Map

- Modify: `scripts/dev.ts`
- Create or modify: `tests/unit/dev-script.test.ts`

### Task 1: Extract Thumbnail Loop Into Testable Helpers

**Files:**

- Create: `tests/unit/dev-script.test.ts`
- Modify: `scripts/dev.ts`

- [ ] **Step 1: Write the failing test for the initial 60-second delay**

Add a new test file with a timer-driven test in this shape:

```ts
import { describe, expect, it, vi } from "vitest";

import { startThumbnailRefreshLoop } from "../../scripts/dev";

describe("thumbnail refresh loop", () => {
  it("waits 60 seconds before the first thumbnail generation", async () => {
    vi.useFakeTimers();
    const generate = vi.fn().mockResolvedValue(undefined);

    startThumbnailRefreshLoop({
      initialDelayMs: 60000,
      refreshIntervalMs: 10000,
      generate,
      log: () => undefined,
    });

    await vi.advanceTimersByTimeAsync(59000);
    expect(generate).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);
    expect(generate).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the new test to verify it fails**

Run: `npm run test -- tests/unit/dev-script.test.ts`
Expected: FAIL because `startThumbnailRefreshLoop` does not exist yet.

- [ ] **Step 3: Write minimal implementation for a testable loop helper**

In `scripts/dev.ts`, extract the behavior into exported helpers instead of keeping thumbnail generation inline. Use code in this shape:

```ts
export interface ThumbnailRefreshLoopOptions {
  initialDelayMs: number;
  refreshIntervalMs: number;
  generate: () => Promise<void>;
  log: (message: string) => void;
}

export interface ThumbnailRefreshLoopHandle {
  stop(): void;
}

export function startThumbnailRefreshLoop(
  options: ThumbnailRefreshLoopOptions,
): ThumbnailRefreshLoopHandle {
  let stopped = false;

  const run = async (): Promise<void> => {
    options.log(
      "Generating thumbnails in 60 seconds (waiting for more segments)...",
    );
    await wait(options.initialDelayMs);

    while (!stopped) {
      await options.generate();
      await wait(options.refreshIntervalMs);
    }
  };

  void run();

  return {
    stop() {
      stopped = true;
    },
  };
}
```

Also add a small exported `wait(ms: number)` helper so fake timers can drive it through normal timer behavior.

Do not leave `void main();` as an unconditional side effect if tests import this file. Move the runtime entrypoint behind a small guard so the helpers can be imported safely from tests, for example by exporting `main` and using a direct-execution check that only runs it from the CLI path.

- [ ] **Step 4: Run the new test to verify it passes**

Run: `npm run test -- tests/unit/dev-script.test.ts`
Expected: PASS

### Task 2: Keep Regenerating Every 10 Seconds

**Files:**

- Modify: `tests/unit/dev-script.test.ts`
- Modify: `scripts/dev.ts`

- [ ] **Step 1: Write the failing test for repeated regeneration**

Extend the same test file with:

```ts
it("regenerates thumbnails every 10 seconds after the first run", async () => {
  vi.useFakeTimers();
  const generate = vi.fn().mockResolvedValue(undefined);

  startThumbnailRefreshLoop({
    initialDelayMs: 60000,
    refreshIntervalMs: 10000,
    generate,
    log: () => undefined,
  });

  await vi.advanceTimersByTimeAsync(60000);
  expect(generate).toHaveBeenCalledTimes(1);

  await vi.advanceTimersByTimeAsync(10000);
  expect(generate).toHaveBeenCalledTimes(2);

  await vi.advanceTimersByTimeAsync(10000);
  expect(generate).toHaveBeenCalledTimes(3);
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npm run test -- tests/unit/dev-script.test.ts`
Expected: FAIL because the helper only covers the first generation correctly or does not repeat yet.

- [ ] **Step 3: Implement the repeating loop with a fixed 10-second interval**

Update `scripts/dev.ts` so the helper waits `refreshIntervalMs` after each generation and then continues until stopped. The loop body should stay minimal:

```ts
while (!stopped) {
  await options.generate();

  if (stopped) {
    return;
  }

  await wait(options.refreshIntervalMs);
}
```

In `main()`, prepare the real generator callback in this shape:

```ts
const generateThumbnails = async (): Promise<void> => {
  await generateThumbnailArtifacts(config, process.cwd(), {
    ensureDirectory: async (path) => {
      await mkdir(path, { recursive: true });
    },
    writeTextFile: async (path, content) => {
      await writeFile(path, content, "utf8");
    },
  });
};
```

- [ ] **Step 4: Run the targeted test to verify it passes**

Run: `npm run test -- tests/unit/dev-script.test.ts`
Expected: PASS

### Task 3: Retry On Failure Without Breaking The Loop

**Files:**

- Modify: `tests/unit/dev-script.test.ts`
- Modify: `scripts/dev.ts`

- [ ] **Step 1: Write the failing test for retry-after-error behavior**

Add this test:

```ts
it("logs errors and retries on the next 10-second interval", async () => {
  vi.useFakeTimers();
  const log = vi.fn();
  const generate = vi
    .fn<() => Promise<void>>()
    .mockRejectedValueOnce(new Error("thumbnail failed"))
    .mockResolvedValueOnce(undefined);

  startThumbnailRefreshLoop({
    initialDelayMs: 60000,
    refreshIntervalMs: 10000,
    generate,
    log,
  });

  await vi.advanceTimersByTimeAsync(60000);
  expect(log).toHaveBeenCalledWith(expect.stringContaining("thumbnail failed"));

  await vi.advanceTimersByTimeAsync(10000);
  expect(generate).toHaveBeenCalledTimes(2);
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npm run test -- tests/unit/dev-script.test.ts`
Expected: FAIL because the rejected promise currently aborts the loop.

- [ ] **Step 3: Add per-iteration error handling and logging**

Wrap the generation call, not the whole loop, so one failure does not stop future iterations:

```ts
while (!stopped) {
  try {
    await options.generate();
    options.log("Thumbnails generated.");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown thumbnail error.";
    options.log(`Thumbnail generation failed: ${message}`);
  }

  if (stopped) {
    return;
  }

  await wait(options.refreshIntervalMs);
}
```

- [ ] **Step 4: Run the targeted test to verify it passes**

Run: `npm run test -- tests/unit/dev-script.test.ts`
Expected: PASS

### Task 4: Stop The Loop During Shutdown

**Files:**

- Modify: `tests/unit/dev-script.test.ts`
- Modify: `scripts/dev.ts`

- [ ] **Step 1: Write the failing test for stop behavior**

Add this test:

```ts
it("stops scheduling new generations after stop is called", async () => {
  vi.useFakeTimers();
  const generate = vi.fn().mockResolvedValue(undefined);

  const handle = startThumbnailRefreshLoop({
    initialDelayMs: 60000,
    refreshIntervalMs: 10000,
    generate,
    log: () => undefined,
  });

  await vi.advanceTimersByTimeAsync(60000);
  expect(generate).toHaveBeenCalledTimes(1);

  handle.stop();
  await vi.advanceTimersByTimeAsync(30000);
  expect(generate).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npm run test -- tests/unit/dev-script.test.ts`
Expected: FAIL because timers or loop state still allow another iteration.

- [ ] **Step 3: Wire the loop into `main()` and stop it on shutdown**

In `scripts/dev.ts`:

1. Keep a handle near the top of `main()`:

```ts
let thumbnailLoop: ThumbnailRefreshLoopHandle | null = null;
```

2. Start it only when `options.startFfmpeg` is true:

```ts
thumbnailLoop = startThumbnailRefreshLoop({
  initialDelayMs: 60000,
  refreshIntervalMs: 10000,
  generate: generateThumbnails,
  log: console.log,
});
```

3. Stop it during shutdown before process cleanup:

```ts
thumbnailLoop?.stop();
```

Put the stop call in both shutdown paths already used by the script:

- inside `waitForShutdownSignal` cleanup path
- inside `onShutdown` passed to `startLiveControlServer`

- [ ] **Step 4: Run the targeted test to verify it passes**

Run: `npm run test -- tests/unit/dev-script.test.ts`
Expected: PASS

### Task 5: Full Verification

**Files:**

- Modify only if verification reveals a real issue

- [ ] **Step 1: Run focused tests**

Run: `npm run test -- tests/unit/dev-script.test.ts tests/unit/thumbnail-service.test.ts tests/unit/thumbnail-preview.test.ts tests/unit/controls.test.ts`
Expected: PASS

- [ ] **Step 2: Run full repository validation**

Run: `make lint`
Expected: PASS

Run: `make typecheck`
Expected: PASS

Run: `make test`
Expected: PASS

Run: `make build`
Expected: PASS

Run: `make e2e`
Expected: PASS

- [ ] **Step 3: Real local behavior check**

Run: `make startup-all`

Then verify:

- around 60 seconds after startup, `output/dash/thumbnails/metadata.json` appears
- after another 10-20 seconds, the metadata file content changes again
- the `imageUrl` query version changes over time
- the browser seek hover starts showing newer thumbnails without running `make thumbnails-generate`
