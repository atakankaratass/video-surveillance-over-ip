import type { AppConfig, SegmentDurationSeconds } from "../config";

export function createLatencyRunConfig(
  baseConfig: AppConfig,
  segmentDurationSeconds: SegmentDurationSeconds,
  port: number,
): AppConfig {
  return {
    ...baseConfig,
    paths: {
      ...baseConfig.paths,
      dashRoot: `./output/dash-${segmentDurationSeconds}s`,
    },
    streaming: {
      ...baseConfig.streaming,
      segmentDurationSeconds,
    },
    server: {
      ...baseConfig.server,
      port,
    },
  };
}
