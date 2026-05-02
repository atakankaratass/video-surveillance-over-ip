import type { ServerBootstrapResult } from "./server";
import type { StartupPlan } from "./startupPlan";

export function formatStartupSummary(
  bootstrap: Pick<ServerBootstrapResult, "nginxConfigPath" | "manifestPath">,
  startupPlan: StartupPlan,
): string {
  const nginxCommand = [
    startupPlan.nginx.command,
    ...startupPlan.nginx.args,
  ].join(" ");
  const ffmpegCommand = [
    startupPlan.ffmpeg.command,
    ...startupPlan.ffmpeg.args,
  ].join(" ");

  return [
    `Generated NGINX config: ${bootstrap.nginxConfigPath}`,
    `FFmpeg manifest target: ${bootstrap.manifestPath}`,
    `Audio mode: ${startupPlan.audioEnabled ? "enabled" : "disabled"}`,
    `ABR mode: ${startupPlan.abrEnabled ? "enabled" : "disabled"}`,
    `Player URL: ${startupPlan.playerUrl}`,
    `Manifest URL: ${startupPlan.manifestUrl}`,
    `NGINX command: ${nginxCommand}`,
    `FFmpeg command: ${ffmpegCommand}`,
  ].join("\n");
}
