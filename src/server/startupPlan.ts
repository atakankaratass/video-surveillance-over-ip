import type { AppConfig } from "./config";
import { buildAudioCommand } from "./ffmpeg/buildAudioCommand";
import { buildBaselineCommand } from "./ffmpeg/buildBaselineCommand";
import { resolveProjectPath } from "./runtimePaths";

export interface StartupPlan {
  ffmpeg: ReturnType<typeof buildBaselineCommand>;
  nginx: {
    command: string;
    args: string[];
  };
  playerUrl: string;
  manifestUrl: string;
  audioEnabled: boolean;
}

export interface StartupPlanOptions {
  audio?: boolean;
}

export function createStartupPlan(
  config: AppConfig,
  projectRoot: string,
  options: StartupPlanOptions = {},
): StartupPlan {
  const audioEnabled = options.audio ?? false;
  const ffmpeg = audioEnabled
    ? buildAudioCommand(config)
    : buildBaselineCommand(config);
  const nginxConfigPath = resolveProjectPath(
    projectRoot,
    "configs/nginx/generated.conf",
  );
  const playerBaseUrl = `http://${config.server.host}:${config.server.port}`;
  const playerUrl = audioEnabled
    ? `${playerBaseUrl}/?manifest=${encodeURIComponent("/dash/live-audio.mpd")}`
    : playerBaseUrl;

  return {
    ffmpeg,
    nginx: {
      command: "nginx",
      args: ["-c", nginxConfigPath, "-p", projectRoot],
    },
    playerUrl,
    manifestUrl: `${playerBaseUrl}/dash/${audioEnabled ? "live-audio" : "live"}.mpd`,
    audioEnabled,
  };
}
