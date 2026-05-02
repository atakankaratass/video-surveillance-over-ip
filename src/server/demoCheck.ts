import type { AppConfig } from "./config";
import type { CaptureDevice } from "./ffmpeg/parseAvfoundationDevices";
import {
  evaluateStartupRequirements,
  formatStartupRequirementsReport,
} from "./startupRequirements";

export interface DemoReadinessInputs {
  environmentOk: boolean;
  hasGeneratedNginxConfig: boolean;
  hasDashDirectory: boolean;
  hasManifest: boolean;
  availableVideoDevices: CaptureDevice[];
}

export interface DemoReadinessResult {
  ok: boolean;
  issues: string[];
}

export function evaluateDemoReadiness(
  _config: AppConfig,
  inputs: DemoReadinessInputs,
): DemoReadinessResult {
  const issues: string[] = [];

  if (!inputs.environmentOk) {
    issues.push("Environment validation is failing.");
  }

  if (!inputs.hasGeneratedNginxConfig) {
    issues.push("Generated NGINX config is missing.");
  }

  if (!inputs.hasDashDirectory) {
    issues.push("DASH output directory is missing.");
  }

  if (!inputs.hasManifest) {
    issues.push("Live DASH manifest is missing.");
  }

  if (inputs.availableVideoDevices.length === 0) {
    issues.push("No video capture devices were discovered.");
  }

  return {
    ok: issues.length === 0,
    issues,
  };
}

export function formatDemoReadinessReport(result: DemoReadinessResult): string {
  const heading = result.ok
    ? "Preflight readiness: READY"
    : "Preflight readiness: NOT READY";

  if (result.issues.length === 0) {
    return `${heading}\n- No blocking issues detected.`;
  }

  return `${heading}\n${result.issues.map((issue) => `- ${issue}`).join("\n")}`;
}

export function formatCombinedDemoAndStartupReport(
  demoResult: DemoReadinessResult,
  startupInputs: { ffmpegAvailable: boolean; nginxAvailable: boolean },
): string {
  return [
    formatStartupRequirementsReport(evaluateStartupRequirements(startupInputs)),
    formatDemoReadinessReport(demoResult),
  ].join("\n\n");
}
