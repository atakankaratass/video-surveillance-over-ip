import { writeFile } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { parseAppConfig } from "../src/server/config";
import { generateNginxConfig } from "../src/server/nginx/generateConfig";

async function main(): Promise<void> {
  const configPath = process.argv[2] ?? "configs/app.example.json";
  const outputPath = process.argv[3] ?? "configs/nginx/generated.conf";
  const projectRoot = process.cwd();
  const configText = await readFile(configPath, "utf8");
  const config = parseAppConfig(JSON.parse(configText));
  const nginxConfig = generateNginxConfig(config, projectRoot);

  await writeFile(resolve(projectRoot, outputPath), nginxConfig, "utf8");
  console.log(`NGINX config written to ${outputPath}`);
}

void main();
