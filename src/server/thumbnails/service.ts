import { execFile } from "node:child_process";
import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

import type { AppConfig } from "../config";
import { buildSpriteMetadata } from "./metadata";

const execFileAsync = promisify(execFile);

export interface ThumbnailGenerationDependencies {
  ensureDirectory(path: string): Promise<void>;
  writeTextFile(path: string, content: string): Promise<void>;
}

export interface ThumbnailGenerationResult {
  imagePath: string;
  imageUrl: string;
  metadataPath: string;
  metadataUrl: string;
}

function parseSegmentSequence(fileName: string): number | null {
  const match = fileName.match(/^chunk-stream0-(\d+)\.m4s$/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

function getSegmentStartTimeSeconds(
  fileName: string,
  segmentDurationSeconds: number,
): number {
  const sequence = parseSegmentSequence(fileName);

  if (sequence === null) {
    return 0;
  }

  return Math.max(0, sequence - 1) * segmentDurationSeconds;
}

export function getThumbnailFrameCount(
  dvrWindowSeconds: number,
  intervalSeconds: number,
): number {
  const safeWindow = Math.max(0, dvrWindowSeconds);
  const safeInterval = Math.max(1, intervalSeconds);

  return Math.max(3, Math.floor(safeWindow / safeInterval) + 1);
}

export async function selectThumbnailSourceSegments(
  entries: string[],
  count: number,
): Promise<string[]> {
  const sorted = entries
    .map((entry) => ({ entry, sequence: parseSegmentSequence(entry) }))
    .filter(
      (item): item is { entry: string; sequence: number } =>
        item.sequence !== null,
    )
    .sort((left, right) => left.sequence - right.sequence)
    .map((item) => item.entry);

  const stableEntries = sorted.length > 1 ? sorted.slice(0, -1) : sorted;

  if (stableEntries.length <= count) {
    return stableEntries;
  }

  if (count <= 1) {
    return [
      stableEntries[stableEntries.length - 1] ??
        sorted[sorted.length - 1] ??
        "",
    ].filter(Boolean);
  }

  const selectedIndices = new Set<number>();

  for (let index = 0; index < count; index += 1) {
    selectedIndices.add(
      Math.round((index * (stableEntries.length - 1)) / (count - 1)),
    );
  }

  return Array.from(selectedIndices)
    .sort((left, right) => left - right)
    .map((index) => stableEntries[index])
    .filter((entry): entry is string => Boolean(entry));
}

export function buildSpriteCommandArgs(
  framePaths: string[],
  outputPath: string,
): string[] {
  if (framePaths.length === 1) {
    return [
      "-hide_banner",
      "-y",
      "-i",
      framePaths[0] ?? "",
      "-frames:v",
      "1",
      outputPath,
    ];
  }

  return [
    "-hide_banner",
    "-y",
    ...framePaths.flatMap((framePath) => ["-i", framePath]),
    "-filter_complex",
    `hstack=inputs=${framePaths.length}`,
    outputPath,
  ];
}

export async function generateThumbnailArtifacts(
  config: AppConfig,
  projectRoot: string,
  dependencies: ThumbnailGenerationDependencies,
): Promise<ThumbnailGenerationResult> {
  const thumbnailDirectory = join(
    projectRoot,
    config.paths.dashRoot,
    "thumbnails",
  );
  const dashDirectory = join(projectRoot, config.paths.dashRoot);
  const imagePath = join(thumbnailDirectory, "sprite.jpg");
  const tempImagePath = join(thumbnailDirectory, "sprite.tmp.jpg");
  const metadataPath = join(thumbnailDirectory, "metadata.json");
  const imageUrl = "/dash/thumbnails/sprite.jpg";
  const metadataUrl = "/dash/thumbnails/metadata.json";
  const frameWidth = 160;
  const frameHeight = 90;
  const frameCount = getThumbnailFrameCount(
    config.streaming.dvrWindowSeconds,
    config.thumbnails.intervalSeconds,
  );

  await dependencies.ensureDirectory(thumbnailDirectory);

  const dashEntries = await readdir(dashDirectory);
  const selectedSegments = await selectThumbnailSourceSegments(
    dashEntries,
    frameCount,
  );

  if (selectedSegments.length === 0) {
    throw new Error(
      "No baseline DASH video segments are available for thumbnail generation.",
    );
  }

  const initSegmentPath = join(dashDirectory, "init-stream0.m4s");
  const framePaths: string[] = [];

  for (const [index, segmentFileName] of selectedSegments.entries()) {
    const combinedSegmentPath = join(
      thumbnailDirectory,
      `segment-${index}.mp4`,
    );
    const framePath = join(thumbnailDirectory, `frame-${index}.jpg`);
    const initSegment = await readFile(initSegmentPath);
    const mediaSegment = await readFile(join(dashDirectory, segmentFileName));

    await writeFile(
      combinedSegmentPath,
      Buffer.concat([initSegment, mediaSegment]),
    );

    await execFileAsync("ffmpeg", [
      "-hide_banner",
      "-y",
      "-i",
      combinedSegmentPath,
      "-frames:v",
      "1",
      "-vf",
      `scale=${frameWidth}:${frameHeight}`,
      framePath,
    ]);

    framePaths.push(framePath);
  }

  await execFileAsync(
    "ffmpeg",
    buildSpriteCommandArgs(framePaths, tempImagePath),
  );

  await rename(tempImagePath, imagePath);

  const metadata = buildSpriteMetadata({
    imageUrl,
    frameWidth,
    frameHeight,
    entryTimesSeconds: selectedSegments.map((segmentFileName) =>
      getSegmentStartTimeSeconds(
        segmentFileName,
        config.streaming.segmentDurationSeconds,
      ),
    ),
  });

  await dependencies.writeTextFile(
    metadataPath,
    JSON.stringify(metadata, null, 2),
  );

  return {
    imagePath,
    imageUrl,
    metadataPath,
    metadataUrl,
  };
}
