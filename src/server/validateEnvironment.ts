import type { AppConfig } from "./config";

export interface EnvironmentValidationResult {
  ok: boolean;
  issues: string[];
}

export interface EnvironmentDependencies {
  commandExists(command: string): Promise<boolean>;
  directoryWritable(path: string): Promise<boolean>;
  portAvailable(port: number): Promise<boolean>;
}

export async function validateEnvironment(
  config: AppConfig,
  dependencies: EnvironmentDependencies,
): Promise<EnvironmentValidationResult> {
  const issues: string[] = [];

  if (!(await dependencies.commandExists("ffmpeg"))) {
    issues.push("FFmpeg is not available on PATH.");
  }

  if (!(await dependencies.commandExists("nginx"))) {
    issues.push("NGINX is not available on PATH.");
  }

  const outputPaths = [config.paths.outputRoot, config.paths.dashRoot];

  for (const outputPath of outputPaths) {
    if (!(await dependencies.directoryWritable(outputPath))) {
      issues.push(`Path is not writable: ${outputPath}`);
    }
  }

  if (!(await dependencies.portAvailable(config.server.port))) {
    issues.push(`Configured server port is unavailable: ${config.server.port}`);
  }

  return {
    ok: issues.length === 0,
    issues,
  };
}
