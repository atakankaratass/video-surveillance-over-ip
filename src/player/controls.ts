import type { PlayerStatus } from "./playerShell";

export interface SeekableRange {
  length: number;
  start(index: number): number;
  end(index: number): number;
}

export interface SeekRange {
  start: number;
  end: number;
}

export function getPauseButtonLabel(status: PlayerStatus): string {
  return status === "paused" ? "Resume" : "Pause";
}

export function getToggledPlaybackStatus(status: PlayerStatus): PlayerStatus {
  return status === "paused" ? "live" : "paused";
}

export function getLiveEdgeTime(seekable: SeekableRange): number | null {
  if (seekable.length === 0) {
    return null;
  }

  return seekable.end(seekable.length - 1);
}

export function getSeekRange(seekable: SeekableRange): SeekRange | null {
  if (seekable.length === 0) {
    return null;
  }

  const lastRangeIndex = seekable.length - 1;

  return {
    start: seekable.start(lastRangeIndex),
    end: seekable.end(lastRangeIndex),
  };
}

export function getSeekValue(
  currentTime: number,
  rangeStart: number,
  rangeEnd: number,
): number {
  if (rangeEnd <= rangeStart) {
    return 100;
  }

  const rawRatio = ((currentTime - rangeStart) / (rangeEnd - rangeStart)) * 100;
  return Math.min(100, Math.max(0, Math.round(rawRatio)));
}

export function getSeekTargetTime(
  sliderValue: number,
  rangeStart: number,
  rangeEnd: number,
): number {
  const safeValue = Math.min(100, Math.max(0, sliderValue));
  return rangeStart + ((rangeEnd - rangeStart) * safeValue) / 100;
}

export function formatPlaybackTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (safeSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}
