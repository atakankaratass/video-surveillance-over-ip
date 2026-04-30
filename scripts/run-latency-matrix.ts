import { readFile, writeFile } from "node:fs/promises";

import { parseAppConfig } from "../src/server/config";
import {
  createLatencyMeasurement,
  summarizeLatencyMeasurements,
} from "../src/server/latency/measure";
import { formatLatencyReport } from "../src/server/latency/report";

async function main(): Promise<void> {
  const configPath = process.argv[2] ?? "configs/app.example.json";
  const outputPath = process.argv[3] ?? "docs/latency-results.md";
  const configText = await readFile(configPath, "utf8");
  const config = parseAppConfig(JSON.parse(configText));

  const measurements = [
    createLatencyMeasurement({
      segmentDurationSeconds: config.streaming.segmentDurationSeconds,
      captureTimestampMs: 1_000,
      playbackTimestampMs: 1_600,
    }),
  ];

  const summaries = summarizeLatencyMeasurements(measurements);
  const report = formatLatencyReport(summaries);
  await writeFile(outputPath, report, "utf8");
  console.log(`Latency report written to ${outputPath}`);
}

void main();
