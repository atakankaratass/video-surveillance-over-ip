import type { AppConfig } from "./config";
import { buildAbrCommand } from "./ffmpeg/buildAbrCommand";
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
  abrEnabled: boolean;
}

export interface StartupPlanOptions {
  audio?: boolean;
  abr?: boolean;
}

export function createStartupPlan(
  config: AppConfig,
  projectRoot: string,
  options: StartupPlanOptions = {},
): StartupPlan {
  const audioEnabled = options.audio ?? false;
  const abrEnabled = options.abr ?? false;

  if (audioEnabled && abrEnabled) {
    throw new Error("Cannot enable both audio and abr modes at the same time.");
  }

  const ffmpeg = abrEnabled
    ? buildAbrCommand(config)
    : audioEnabled
      ? buildAudioCommand(config)
      : buildBaselineCommand(config);

  const nginxConfigPath = resolveProjectPath(
    projectRoot,
    "configs/nginx/generated.conf",
  );
  const playerBaseUrl = `http://${config.server.host}:${config.server.port}`;

  const manifestName = abrEnabled
    ? "live-abr"
    : audioEnabled
      ? "live-audio"
      : "live";

  const playerUrl =
    audioEnabled || abrEnabled
      ? `${playerBaseUrl}/?manifest=${encodeURIComponent(`/dash/${manifestName}.mpd`)}`
      : playerBaseUrl;

  return {
    ffmpeg,
    nginx: {
      command: "nginx",
      args: ["-c", nginxConfigPath, "-p", projectRoot],
    },
    playerUrl,
    manifestUrl: `${playerBaseUrl}/dash/${manifestName}.mpd`,
    audioEnabled,
    abrEnabled,
  };
}
