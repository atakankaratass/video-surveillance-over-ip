import { execFile } from "node:child_process";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

import type { AppConfig } from "../config";
import {
  buildMotionStatusEvent,
  type MotionStatusEvent,
} from "../notifications/events";
import { calculateMotionScore, isMotionDetected } from "./detectMotion";

const execFileAsync = promisify(execFile);

export function selectMotionSourceSegment(entries: string[]): string | null {
  const selected = entries
    .filter((entry) => /^chunk-stream0-\d+\.m4s$/.test(entry))
    .sort();

  return selected.at(-1) ?? null;
}

export async function generateMotionStatus(
  config: AppConfig,
  projectRoot: string,
): Promise<MotionStatusEvent> {
  const dashDirectory = join(projectRoot, config.paths.dashRoot);
  const motionDirectory = join(dashDirectory, "motion");
  const entries = await readdir(dashDirectory);
  const latestSegment = selectMotionSourceSegment(entries);

  if (!latestSegment) {
    return buildMotionStatusEvent({ detected: false, score: 0 });
  }

  const initSegment = await readFile(join(dashDirectory, "init-stream0.m4s"));
  const mediaSegment = await readFile(join(dashDirectory, latestSegment));
  const combinedSegmentPath = join(motionDirectory, "segment.mp4");
  const framePath = join(motionDirectory, "frame.raw");

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
    "scale=32:18,format=gray",
    "-f",
    "rawvideo",
    framePath,
  ]);

  const currentFrame = new Uint8Array(await readFile(framePath));
  const previousFramePath = join(motionDirectory, "previous.raw");
  let score = 0;

  try {
    const previousFrame = new Uint8Array(await readFile(previousFramePath));
    score = calculateMotionScore(previousFrame, currentFrame);
  } catch {
    score = 0;
  }

  await writeFile(previousFramePath, currentFrame);

  return buildMotionStatusEvent({
    detected: isMotionDetected(score, config.motion.threshold),
    score,
  });
}
