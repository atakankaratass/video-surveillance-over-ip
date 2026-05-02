import { mkdir, readFile, writeFile } from "node:fs/promises";

import { parseAppConfig } from "../src/server/config";
import { generateMotionStatus } from "../src/server/motion/service";

async function main(): Promise<void> {
  const configPath = process.argv[2] ?? "configs/app.example.json";
  const configText = await readFile(configPath, "utf8");
  const config = parseAppConfig(JSON.parse(configText));
  const motionDirectory = `${process.cwd()}/${config.paths.dashRoot}/motion`;

  await mkdir(motionDirectory, { recursive: true });

  const status = await generateMotionStatus(config, process.cwd());
  await writeFile(
    `${motionDirectory}/status.json`,
    JSON.stringify(status, null, 2),
    "utf8",
  );

  console.log(`Motion status written to ${motionDirectory}/status.json`);
}

void main();
