import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { parseAppConfig } from "../src/server/config";
import { parseDevOptions } from "../src/server/devOptions";
import { createProcessManager } from "../src/server/ffmpeg/processManager";
import { listAvfoundationDevices } from "../src/server/ffmpeg/listAvfoundationDevices";
import { startLiveControlServer } from "../src/server/liveControlServer";
import { bootstrapServer } from "../src/server/server";
import { createStartupPlan } from "../src/server/startupPlan";
import { formatStartupSummary } from "../src/server/startupSummary";
import { generateThumbnailArtifacts } from "../src/server/thumbnails/service";

function waitForShutdownSignal(
  processManager: ReturnType<typeof createProcessManager>,
): Promise<void> {
  return new Promise((resolvePromise) => {
    const shutdown = async (): Promise<void> => {
      process.off("SIGINT", handleSignal);
      process.off("SIGTERM", handleSignal);
      await processManager.stopAll();
      resolvePromise();
    };

    const handleSignal = (): void => {
      void shutdown();
    };

    process.on("SIGINT", handleSignal);
    process.on("SIGTERM", handleSignal);
  });
}

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
  let controlServer: Awaited<ReturnType<typeof startLiveControlServer>> | null =
    null;

  const bootstrap = await bootstrapServer(config, process.cwd(), {
    ensureDirectory: async (path) => {
      await mkdir(path, { recursive: true });
    },
    writeTextFile: async (path, content) => {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, content, "utf8");
    },
  });
  const startupPlan = createStartupPlan(config, process.cwd(), {
    audio: options.audio,
    abr: options.abr,
  });
  const heartbeatPort = config.server.port + 1;

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

    console.log("Generating thumbnails in 15 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 15000));

    await generateThumbnailArtifacts(config, process.cwd(), {
      ensureDirectory: async (path) => {
        await mkdir(path, { recursive: true });
      },
      writeTextFile: async (path, content) => {
        await writeFile(path, content, "utf8");
      },
    });
    console.log("Thumbnails generated.");
  }

  if (options.startNginx || options.startFfmpeg) {
    controlServer = await startLiveControlServer({
      port: heartbeatPort,
      sessionTimeoutMs: 86400000, // 24 hours
      onShutdown: async () => {
        await processManager.stopAll();
      },
    });
    console.log(`Heartbeat URL: ${controlServer.heartbeatUrl}`);
    console.log("Processes running. Press Ctrl+C to stop them cleanly.");
    await waitForShutdownSignal(processManager);
    await controlServer.close();
  }
}

void main();
