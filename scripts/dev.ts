import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { parseAppConfig } from "../src/server/config";
import { createProcessManager } from "../src/server/ffmpeg/processManager";
import { bootstrapServer } from "../src/server/server";

async function main(): Promise<void> {
  const configPath = process.argv[2] ?? "configs/app.example.json";
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
    writeTextFile: async (path, content) => {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, content, "utf8");
    },
  });

  console.log(`Generated NGINX config at ${bootstrap.nginxConfigPath}`);
  console.log(`FFmpeg manifest target: ${bootstrap.manifestPath}`);
  console.log(`Ready to start ffmpeg: ${bootstrap.ffmpeg.command}`);

  if (process.argv.includes("--start-ffmpeg")) {
    await processManager.start(
      "ffmpeg",
      bootstrap.ffmpeg.command,
      bootstrap.ffmpeg.args,
    );
    console.log("FFmpeg process started.");
  }
}

void main();
