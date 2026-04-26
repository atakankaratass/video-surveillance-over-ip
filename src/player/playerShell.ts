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
      <video
        data-testid="player-video"
        controls
        muted
        playsinline
        aria-label="Live surveillance video"
        width="640"
        height="360"
      ></video>
      <div aria-label="Player controls">
        <button type="button">Pause</button>
        <button type="button">Go Live</button>
        <button type="button">Screenshot</button>
      </div>
    </section>
  `;
}
