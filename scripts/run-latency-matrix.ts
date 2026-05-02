import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { chromium } from "playwright";

import type { AppConfig, SegmentDurationSeconds } from "../src/server/config";
import { parseAppConfig } from "../src/server/config";
import {
  createLatencyMeasurement,
  summarizeLatencyMeasurements,
} from "../src/server/latency/measure";
import { formatLatencyReport } from "../src/server/latency/report";
import { createLatencyRunConfig } from "../src/server/latency/runConfig";

async function waitForUrl(url: string, timeoutMs: number): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until timeout.
    }

    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
  }

  throw new Error(`Timed out waiting for URL: ${url}`);
}

async function stopLiveStack(): Promise<void> {
  const child = spawn("npm", ["run", "startup:stop"], {
    cwd: process.cwd(),
    stdio: "ignore",
    env: process.env,
  });

  await new Promise<void>((resolvePromise) => {
    child.once("exit", () => resolvePromise());
  });
}

async function measureSegmentDuration(
  configPath: string,
  port: number,
  segmentDurationSeconds: SegmentDurationSeconds,
): Promise<ReturnType<typeof createLatencyMeasurement>> {
  await stopLiveStack();
  const startedAt = Date.now();
  const child = spawn("npm", ["run", "startup:all", "--", configPath], {
    cwd: process.cwd(),
    stdio: "ignore",
    env: process.env,
  });

  try {
    const playerUrl = `http://127.0.0.1:${port}/`;
    await waitForUrl(playerUrl, 45_000);

    const browser = await chromium.launch({ headless: true });

    try {
      const page = await browser.newPage();
      await page.goto(playerUrl, { waitUntil: "load" });

      await page.waitForFunction(
        () => {
          const video = document.querySelector(
            '[data-testid="player-video"]',
          ) as HTMLVideoElement | null;

          return !!video && video.currentTime > 0;
        },
        { timeout: 45_000 },
      );

      const playbackTimestampMs = Date.now();
      await browser.close();

      return createLatencyMeasurement({
        segmentDurationSeconds,
        captureTimestampMs: startedAt,
        playbackTimestampMs,
      });
    } finally {
      await browser.close().catch(() => undefined);
    }
  } finally {
    child.kill("SIGINT");
    await stopLiveStack();
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 6_000));
  }
}

async function main(): Promise<void> {
  const configPath = process.argv[2] ?? "configs/app.example.json";
  const outputPath = process.argv[3] ?? "docs/latency-results.md";
  const configText = await readFile(configPath, "utf8");
  const config = parseAppConfig(JSON.parse(configText));
  const tempDirectory = await mkdtemp(join(tmpdir(), "cs418-latency-"));

  try {
    const runs: Array<{
      segmentDurationSeconds: SegmentDurationSeconds;
      port: number;
    }> = [
      { segmentDurationSeconds: 2, port: 8092 },
      { segmentDurationSeconds: 4, port: 8094 },
      { segmentDurationSeconds: 6, port: 8096 },
    ];

    const measurements = [];

    for (const run of runs) {
      const derivedConfig: AppConfig = createLatencyRunConfig(
        config,
        run.segmentDurationSeconds,
        run.port,
      );
      const tempConfigPath = resolve(
        tempDirectory,
        `latency-${run.segmentDurationSeconds}s.json`,
      );
      await writeFile(
        tempConfigPath,
        JSON.stringify(derivedConfig, null, 2),
        "utf8",
      );

      const measurement = await measureSegmentDuration(
        tempConfigPath,
        run.port,
        run.segmentDurationSeconds,
      );
      measurements.push(measurement);
    }

    const summaries = summarizeLatencyMeasurements(measurements);
    const report = formatLatencyReport(summaries);
    await writeFile(outputPath, report, "utf8");
    console.log(`Latency report written to ${outputPath}`);
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
}

void main();
