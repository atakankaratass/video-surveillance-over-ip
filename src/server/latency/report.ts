import type { LatencySummary } from "./measure";

export function formatLatencyReport(summaries: LatencySummary[]): string {
  const lines = [
    "| Segment (s) | Samples | Avg Latency (ms) | Min | Max |",
    "| --- | --- | --- | --- | --- |",
  ];

  for (const summary of summaries) {
    lines.push(
      `| ${summary.segmentDurationSeconds} | ${summary.count} | ${summary.averageLatencyMs} | ${summary.minLatencyMs} | ${summary.maxLatencyMs} |`,
    );
  }

  return lines.join("\n");
}
