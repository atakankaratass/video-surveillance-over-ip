import type { PlayerStatus } from "./playerShell";

export interface SeekableRange {
  length: number;
  end(index: number): number;
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
