import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { parseAppConfig } from "../src/server/config";
import { parseDevOptions } from "../src/server/devOptions";
import { createProcessManager } from "../src/server/ffmpeg/processManager";
import { listAvfoundationDevices } from "../src/server/ffmpeg/listAvfoundationDevices";
import { bootstrapServer } from "../src/server/server";
import { createStartupPlan } from "../src/server/startupPlan";
import { formatStartupSummary } from "../src/server/startupSummary";

async function main(): Promise<void> {
  const options = parseDevOptions(process.argv.slice(2));

  if (options.listDevices) {
    const devices = await listAvfoundationDevices();

    console.log("Video devices:");
    for (const device of devices.video) {
      console.log(`  [${device.id}] ${device.name}`);
    }

    console.log("Audio devices:");
    for (const device of devices.audio) {
      console.log(`  [${device.id}] ${device.name}`);
    }

    return;
  }

  const configPath = options.configPath;
  const configText = await readFile(configPath, "utf8");
  const config = parseAppConfig(JSON.parse(configText));
  const processManager = createProcessManager({
    spawnProcess: async (command, args) => {
      const child = spawn(command, args, {
        stdio: "inherit",
      });

      return {
        pid: child.pid ?? -1,
        kill(signal) {
          child.kill(signal);
        },
      };
    },
  });

  const bootstrap = await bootstrapServer(config, process.cwd(), {
    ensureDirectory: async (path) => {
      await mkdir(path, { recursive: true });
    },
    writeTextFile: async (path, content) => {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, content, "utf8");
    },
  });
  const startupPlan = createStartupPlan(config, process.cwd());

  console.log(
    formatStartupSummary(
      {
        nginxConfigPath: bootstrap.nginxConfigPath,
        manifestPath: startupPlan.ffmpeg.manifestPath,
      },
      startupPlan,
    ),
  );

  if (options.startNginx) {
    await processManager.start(
      "nginx",
      startupPlan.nginx.command,
      startupPlan.nginx.args,
    );
    console.log("NGINX process started.");
  }

  if (options.startFfmpeg) {
    await processManager.start(
      "ffmpeg",
      startupPlan.ffmpeg.command,
      startupPlan.ffmpeg.args,
    );
    console.log("FFmpeg process started.");
  }
}

void main();
