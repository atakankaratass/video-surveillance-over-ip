import type { AppConfig } from "../config";

export interface BuiltCommand {
  command: string;
  args: string[];
  manifestPath: string;
}

const MANIFEST_NAME = "live.mpd";

export function buildBaselineCommand(config: AppConfig): BuiltCommand {
  const manifestPath = `${config.paths.dashRoot}/${MANIFEST_NAME}`;
  const windowSize = Math.max(
    1,
    Math.floor(
      config.streaming.dvrWindowSeconds /
        config.streaming.segmentDurationSeconds,
    ),
  );

  return {
    command: "ffmpeg",
    manifestPath,
    args: [
      "-hide_banner",
      "-y",
      "-f",
      "avfoundation",
      "-i",
      config.capture.videoDevice,
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-tune",
      "zerolatency",
      "-g",
      "30",
      "-keyint_min",
      "30",
      "-sc_threshold",
      "0",
      "-pix_fmt",
      "yuv420p",
      "-f",
      "dash",
      "-seg_duration",
      String(config.streaming.segmentDurationSeconds),
      "-window_size",
      String(windowSize),
      "-extra_window_size",
      "0",
      "-remove_at_exit",
      "0",
      manifestPath,
    ],
  };
}
