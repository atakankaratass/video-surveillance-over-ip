export interface LatencyMeasurementInput {
  segmentDurationSeconds: 2 | 4 | 6;
  captureTimestampMs: number;
  playbackTimestampMs: number;
}

export interface LatencyMeasurement extends LatencyMeasurementInput {
  latencyMs: number;
}

export interface LatencySummary {
  segmentDurationSeconds: 2 | 4 | 6;
  count: number;
  averageLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
}

export function calculateLatencyMs(
  captureTimestampMs: number,
  playbackTimestampMs: number,
): number {
  return playbackTimestampMs - captureTimestampMs;
}

export function createLatencyMeasurement(
  input: LatencyMeasurementInput,
): LatencyMeasurement {
  return {
    ...input,
    latencyMs: calculateLatencyMs(
      input.captureTimestampMs,
      input.playbackTimestampMs,
    ),
  };
}

export function summarizeLatencyMeasurements(
  measurements: LatencyMeasurement[],
): LatencySummary[] {
  const grouped = new Map<2 | 4 | 6, LatencyMeasurement[]>();

  for (const measurement of measurements) {
    const existing = grouped.get(measurement.segmentDurationSeconds) ?? [];
    existing.push(measurement);
    grouped.set(measurement.segmentDurationSeconds, existing);
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left - right)
    .map(([segmentDurationSeconds, group]) => {
      const values = group.map((measurement) => measurement.latencyMs);
      const total = values.reduce((sum, value) => sum + value, 0);

      return {
        segmentDurationSeconds,
        count: values.length,
        averageLatencyMs: Math.round(total / values.length),
        minLatencyMs: Math.min(...values),
        maxLatencyMs: Math.max(...values),
      };
    });
}
