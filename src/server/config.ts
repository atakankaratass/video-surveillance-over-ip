export type SegmentDurationSeconds = 2 | 4 | 6;

export interface AppConfig {
  paths: {
    outputRoot: string;
    dashRoot: string;
  };
  capture: {
    videoDevice: string;
    audioDevice: string | null;
  };
  streaming: {
    segmentDurationSeconds: SegmentDurationSeconds;
    dvrWindowSeconds: number;
  };
  server: {
    host: string;
    port: number;
  };
  motion: {
    enabled: boolean;
    threshold: number;
  };
  thumbnails: {
    intervalSeconds: number;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }

  return value;
}

function readNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  return value;
}

function readBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${fieldName} must be a boolean`);
  }

  return value;
}

function readRelativePath(value: unknown, fieldName: string): string {
  const pathValue = readString(value, fieldName);

  if (pathValue.startsWith("/")) {
    throw new Error(`${fieldName} must be relative, not absolute`);
  }

  return pathValue;
}

function readSegmentDuration(value: unknown): SegmentDurationSeconds {
  const duration = readNumber(value, "streaming.segmentDurationSeconds");

  if (duration !== 2 && duration !== 4 && duration !== 6) {
    throw new Error("streaming.segmentDurationSeconds must be one of: 2, 4, 6");
  }

  return duration;
}

export function parseAppConfig(rawConfig: unknown): AppConfig {
  if (!isRecord(rawConfig)) {
    throw new Error("Config root must be an object");
  }

  const paths = rawConfig.paths;
  const capture = rawConfig.capture;
  const streaming = rawConfig.streaming;
  const server = rawConfig.server;
  const motion = rawConfig.motion;
  const thumbnails = rawConfig.thumbnails;

  if (
    !isRecord(paths) ||
    !isRecord(capture) ||
    !isRecord(streaming) ||
    !isRecord(server) ||
    !isRecord(motion) ||
    !isRecord(thumbnails)
  ) {
    throw new Error("Config contains missing or invalid top-level sections");
  }

  return {
    paths: {
      outputRoot: readRelativePath(paths.outputRoot, "paths.outputRoot"),
      dashRoot: readRelativePath(paths.dashRoot, "paths.dashRoot"),
    },
    capture: {
      videoDevice: readString(capture.videoDevice, "capture.videoDevice"),
      audioDevice:
        capture.audioDevice === null
          ? null
          : readString(capture.audioDevice, "capture.audioDevice"),
    },
    streaming: {
      segmentDurationSeconds: readSegmentDuration(
        streaming.segmentDurationSeconds,
      ),
      dvrWindowSeconds: readNumber(
        streaming.dvrWindowSeconds,
        "streaming.dvrWindowSeconds",
      ),
    },
    server: {
      host: readString(server.host, "server.host"),
      port: readNumber(server.port, "server.port"),
    },
    motion: {
      enabled: readBoolean(motion.enabled, "motion.enabled"),
      threshold: readNumber(motion.threshold, "motion.threshold"),
    },
    thumbnails: {
      intervalSeconds: readNumber(
        thumbnails.intervalSeconds,
        "thumbnails.intervalSeconds",
      ),
    },
  };
}
