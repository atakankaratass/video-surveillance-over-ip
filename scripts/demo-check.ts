import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

import { parseAppConfig } from "../src/server/config";
import {
  evaluateDemoReadiness,
  formatDemoReadinessReport,
} from "../src/server/demoCheck";
import { listAvfoundationDevices } from "../src/server/ffmpeg/listAvfoundationDevices";
import { validateEnvironment } from "../src/server/validateEnvironment";

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function commandExists(command: string): Promise<boolean> {
  try {
    const process = await import("node:child_process");
    await new Promise<void>((resolvePromise, rejectPromise) => {
      process.execFile("which", [command], (error) => {
        if (error) {
          rejectPromise(error);
          return;
        }
        resolvePromise();
      });
    });
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const configPath = process.argv[2] ?? "configs/app.example.json";
  const configText = await readFile(configPath, "utf8");
  const config = parseAppConfig(JSON.parse(configText));
  const projectRoot = process.cwd();
  const environment = await validateEnvironment(config, {
    commandExists,
    directoryWritable: async (path) => fileExists(resolve(projectRoot, path)),
  });
  const devices = await listAvfoundationDevices();
  const result = evaluateDemoReadiness(config, {
    environmentOk: environment.ok,
    hasGeneratedNginxConfig: await fileExists(
      resolve(projectRoot, "configs/nginx/generated.conf"),
    ),
    hasDashDirectory: await fileExists(
      resolve(projectRoot, config.paths.dashRoot),
    ),
    hasManifest: await fileExists(
      resolve(projectRoot, `${config.paths.dashRoot}/live.mpd`),
    ),
    availableVideoDevices: devices.video,
  });

  console.log(formatDemoReadinessReport(result));

  if (!result.ok) {
    process.exitCode = 1;
  }
}

void main();
