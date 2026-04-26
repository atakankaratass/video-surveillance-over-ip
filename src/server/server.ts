import { resolve } from "node:path";

import type { AppConfig } from "./config";
import { buildBaselineCommand } from "./ffmpeg/buildBaselineCommand";
import { generateNginxConfig } from "./nginx/generateConfig";

export interface ServerBootstrapDependencies {
  writeTextFile(path: string, content: string): Promise<void>;
}

export interface ServerBootstrapResult {
  ffmpeg: ReturnType<typeof buildBaselineCommand>;
  manifestPath: string;
  nginxConfig: string;
  nginxConfigPath: string;
}

export async function bootstrapServer(
  config: AppConfig,
  projectRoot: string,
  dependencies: ServerBootstrapDependencies,
): Promise<ServerBootstrapResult> {
  const ffmpeg = buildBaselineCommand(config);
  const nginxConfig = generateNginxConfig(config, projectRoot);
  const nginxConfigPath = "configs/nginx/generated.conf";

  await dependencies.writeTextFile(
    resolve(projectRoot, nginxConfigPath),
    nginxConfig,
  );

  return {
    ffmpeg,
    manifestPath: ffmpeg.manifestPath,
    nginxConfig,
    nginxConfigPath,
  };
}
