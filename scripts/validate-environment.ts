import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createServer } from "node:net";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { parseAppConfig } from "../src/server/config";
import { validateEnvironment } from "../src/server/validateEnvironment";

const execFileAsync = promisify(execFile);

async function commandExists(command: string): Promise<boolean> {
  try {
    await execFileAsync("which", [command]);
    return true;
  } catch {
    return false;
  }
}

async function directoryWritable(path: string): Promise<boolean> {
  try {
    await access(dirname(path), constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

async function portAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", () => {
      resolve(false);
    });

    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, "127.0.0.1");
  });
}

async function main(): Promise<void> {
  const configPath = process.argv[2] ?? "configs/app.example.json";
  const configText = await readFile(configPath, "utf8");
  const config = parseAppConfig(JSON.parse(configText));
  const result = await validateEnvironment(config, {
    commandExists,
    directoryWritable,
    portAvailable,
  });

  if (!result.ok) {
    for (const issue of result.issues) {
      console.error(issue);
    }

    process.exitCode = 1;
    return;
  }

  console.log("Environment validation passed.");
}

void main();
