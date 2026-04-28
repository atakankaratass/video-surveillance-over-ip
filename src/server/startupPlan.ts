import type { AppConfig } from "./config";
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
}

export function createStartupPlan(
  config: AppConfig,
  projectRoot: string,
): StartupPlan {
  const ffmpeg = buildBaselineCommand(config);
  const nginxConfigPath = resolveProjectPath(
    projectRoot,
    "configs/nginx/generated.conf",
  );
  const playerUrl = `http://${config.server.host}:${config.server.port}`;

  return {
    ffmpeg,
    nginx: {
      command: "nginx",
      args: ["-c", nginxConfigPath, "-p", projectRoot],
    },
    playerUrl,
    manifestUrl: `${playerUrl}/dash/live.mpd`,
  };
}
