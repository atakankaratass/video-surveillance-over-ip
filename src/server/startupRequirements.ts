export interface StartupRequirementsInputs {
  ffmpegAvailable: boolean;
  nginxAvailable: boolean;
}

export interface StartupRequirementsResult {
  ok: boolean;
  missing: string[];
}

export function evaluateStartupRequirements(
  inputs: StartupRequirementsInputs,
): StartupRequirementsResult {
  const missing: string[] = [];

  if (!inputs.ffmpegAvailable) {
    missing.push("ffmpeg");
  }

  if (!inputs.nginxAvailable) {
    missing.push("nginx");
  }

  return {
    ok: missing.length === 0,
    missing,
  };
}

export function formatStartupRequirementsReport(
  result: StartupRequirementsResult,
): string {
  if (result.ok) {
    return "Startup requirements: READY\n- All required commands are available.";
  }

  return [
    "Startup requirements: NOT READY",
    `Missing commands: ${result.missing.join(", ")}`,
    "Install the missing commands before starting live services.",
  ].join("\n");
}
