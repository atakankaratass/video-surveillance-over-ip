import { resolve } from "node:path";

import type { AppConfig } from "./config";

export function resolveProjectPath(
  projectRoot: string,
  relativePath: string,
): string {
  return resolve(projectRoot, relativePath);
}

export function getRuntimeDirectories(
  config: AppConfig,
  projectRoot: string,
): string[] {
  return [
    resolveProjectPath(projectRoot, config.paths.outputRoot),
    resolveProjectPath(projectRoot, config.paths.dashRoot),
  ];
}
