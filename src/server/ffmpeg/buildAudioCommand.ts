import type { AppConfig } from "../config";

import type { BuiltCommand } from "./buildBaselineCommand";

export function buildAudioCommand(config: AppConfig): BuiltCommand {
  if (!config.capture.audioDevice) {
    throw new Error("capture.audioDevice is required for audio capture.");
  }

  const manifestPath = `${config.paths.dashRoot}/live-audio.mpd`;
  const videoDevice =
    config.capture.inputSource.split(":")[0] ?? config.capture.inputSource;
  const combinedInputSource = `${videoDevice}:${config.capture.audioDevice}`;
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
      "-framerate",
      String(config.capture.frameRate),
      "-use_wallclock_as_timestamps",
      "1",
      "-f",
      config.capture.inputFormat,
      "-pixel_format",
      config.capture.pixelFormat,
      "-video_size",
      config.capture.videoSize,
      "-i",
      combinedInputSource,
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
      "-c:a",
      "aac",
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
