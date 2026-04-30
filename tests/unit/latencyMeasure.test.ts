import { describe, expect, it } from "vitest";

import {
  calculateLatencyMs,
  createLatencyMeasurement,
  summarizeLatencyMeasurements,
} from "../../src/server/latency/measure";

describe("latency measurement", () => {
  it("calculates latency from capture and playback timestamps", () => {
    expect(calculateLatencyMs(1_000, 1_245)).toBe(245);
  });

  it("creates a normalized latency measurement record", () => {
    const measurement = createLatencyMeasurement({
      segmentDurationSeconds: 4,
      captureTimestampMs: 10_000,
      playbackTimestampMs: 10_420,
    });

    expect(measurement.segmentDurationSeconds).toBe(4);
    expect(measurement.latencyMs).toBe(420);
  });

  it("summarizes min, max, and average latency by segment duration", () => {
    const summary = summarizeLatencyMeasurements([
      createLatencyMeasurement({
        segmentDurationSeconds: 2,
        captureTimestampMs: 1_000,
        playbackTimestampMs: 1_300,
      }),
      createLatencyMeasurement({
        segmentDurationSeconds: 2,
        captureTimestampMs: 2_000,
        playbackTimestampMs: 2_500,
      }),
      createLatencyMeasurement({
        segmentDurationSeconds: 4,
        captureTimestampMs: 3_000,
        playbackTimestampMs: 3_900,
      }),
    ]);

    expect(summary).toEqual([
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
  });
});
