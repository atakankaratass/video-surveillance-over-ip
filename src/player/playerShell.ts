import { getPauseButtonLabel } from "./controls";

export type PlayerStatus =
  | "waiting-for-stream"
  | "connecting"
  | "live"
  | "paused"
  | "error";

export function getStatusLabel(status: PlayerStatus): string {
  return `Player status: ${status}`;
}

export function createPlayerShellMarkup(status: PlayerStatus): string {
  return `
    <section>
      <h1>CS 418 Video Surveillance over IP</h1>
      <p data-testid="player-status">${getStatusLabel(status)}</p>
      <p data-testid="screenshot-status">Screenshot status: idle</p>
      <p data-testid="current-time">00:00</p>
      <p data-testid="live-edge-time">00:00</p>
      <video
        data-testid="player-video"
        controls
        muted
        playsinline
        aria-label="Live surveillance video"
        width="640"
        height="360"
      ></video>
      <input
        data-testid="seek-slider"
        type="range"
        min="0"
        max="100"
        value="100"
      />
      <div>
        <input data-testid="seek-input" type="number" min="0" value="0" />
        <button type="button" data-testid="seek-button">Seek</button>
      </div>
      <div aria-label="Player controls">
        <button type="button" data-testid="pause-button">${getPauseButtonLabel(
          status,
        )}</button>
        <button type="button" data-testid="go-live-button">Go Live</button>
        <button type="button" data-testid="screenshot-button">Screenshot</button>
      </div>
    </section>
  `;
}

export interface PlayerShellStateElements {
  statusElement: {
    textContent: string;
  };
  pauseButton: {
    textContent: string;
  };
}

export function applyPlayerShellState(
  elements: PlayerShellStateElements,
  status: PlayerStatus,
): void {
  elements.statusElement.textContent = getStatusLabel(status);
  elements.pauseButton.textContent = getPauseButtonLabel(status);
}
