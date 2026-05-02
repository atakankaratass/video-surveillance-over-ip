import { mkdir, readFile, writeFile } from "node:fs/promises";

import { parseAppConfig } from "../src/server/config";
import { generateThumbnailArtifacts } from "../src/server/thumbnails/service";

async function main(): Promise<void> {
  const configPath = process.argv[2] ?? "configs/app.example.json";
  const configText = await readFile(configPath, "utf8");
  const config = parseAppConfig(JSON.parse(configText));
  const result = await generateThumbnailArtifacts(config, process.cwd(), {
    ensureDirectory: async (path) => {
      await mkdir(path, { recursive: true });
    },
    writeTextFile: async (path, content) => {
      await writeFile(path, content, "utf8");
    },
  });

  console.log(`Thumbnail sprite: ${result.imagePath}`);
  console.log(`Thumbnail metadata: ${result.metadataPath}`);
}

void main();
