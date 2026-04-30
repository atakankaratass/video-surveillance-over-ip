import { describe, expect, it } from "vitest";

import { formatLatencyReport } from "../../src/server/latency/report";

describe("formatLatencyReport", () => {
  it("formats a readable markdown summary table", () => {
    const report = formatLatencyReport([
      {
        segmentDurationSeconds: 2,
        count: 2,
        averageLatencyMs: 400,
        minLatencyMs: 300,
        maxLatencyMs: 500,
      },
      {
        segmentDurationSeconds: 4,
        count: 1,
        averageLatencyMs: 900,
        minLatencyMs: 900,
        maxLatencyMs: 900,
      },
    ]);

    expect(report).toContain(
      "| Segment (s) | Samples | Avg Latency (ms) | Min | Max |",
    );
    expect(report).toContain("| 2 | 2 | 400 | 300 | 500 |");
    expect(report).toContain("| 4 | 1 | 900 | 900 | 900 |");
  });
});
