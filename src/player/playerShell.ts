import { getPauseButtonLabel } from "./controls";

export type PlayerStatus =
  | "waiting-for-stream"
  | "connecting"
  | "live"
  | "paused"
  | "error";

export function getStatusLabel(status: PlayerStatus): string {
  return `Status: ${status}`;
}

export function createPlayerShellMarkup(status: PlayerStatus): string {
  return `
    <section style="font-family:system-ui,sans-serif;max-width:800px;margin:0 auto;padding:20px;">
      <h1 style="margin:0 0 15px;font:24px/1.2 system-ui;background:linear-gradient(135deg,#1a1a2e,#16213e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">CS 418 Video Surveillance over IP</h1>
      <div style="display:flex;gap:10px;margin-bottom:10px;font:14px monospace;color:#555;">
        <span data-testid="player-status">${getStatusLabel(status)}</span>
        <span data-testid="current-time">00:00</span>
        <span>/</span>
        <span data-testid="live-edge-time">LIVE</span>
      </div>
      <div style="position:relative;background:#000;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.3);">
        <video
          data-testid="player-video"
          controls
          muted
          playsinline
          aria-label="Live surveillance video"
          style="width:100%;display:block;aspect-ratio:16/9;background:#111;"
        ></video>
        <div data-testid="motion-notification" hidden style="position:absolute;top:10px;right:10px;background:#ff4444;color:#fff;font:bold 14px sans-serif;padding:8px 16px;border-radius:4px;box-shadow:0 2px 10px rgba(255,68,68,0.5);z-index:10;">⚠ Motion Detected</div>
      </div>
      <div style="margin:15px 0;position:relative;">
        <input
          data-testid="seek-slider"
          type="range"
          min="0"
          max="100"
          value="100"
          style="width:100%;height:24px;-webkit-appearance:none;background:linear-gradient(to right,#4CAF50 0%,#8BC34A var(--progress,100%),#333 var(--progress,100%));border-radius:4px;cursor:pointer;"
        />
        <div
          data-testid="thumbnail-preview"
          hidden
          style="display:none;position:absolute;bottom:35px;left:50%;transform:translateX(-50%);width:160px;height:90px;background-size:160px 90px;background-repeat:no-repeat;border:2px solid #fff;border-radius:6px;box-shadow:0 4px 15px rgba(0,0,0,0.5);pointer-events:none;z-index:100;"
        ></div>
        <div
          data-testid="thumbnail-label"
          hidden
          style="display:none;position:absolute;bottom:130px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#fff;font:12px monospace;padding:4px 8px;border-radius:4px;pointer-events:none;z-index:100;"
        ></div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:10px;">
        <input data-testid="seek-input" type="number" min="0" value="0" style="width:80px;padding:8px;font:14px monospace;background:#222;color:#fff;border:1px solid #444;border-radius:4px;" />
        <button type="button" data-testid="seek-button" style="padding:8px 16px;font:14px bold;background:#333;color:#fff;border:none;border-radius:4px;cursor:pointer;">Seek</button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;" aria-label="Player controls">
        <button type="button" data-testid="pause-button" style="flex:1;min-width:120px;padding:12px 20px;font:bold 14px;background:${status === "paused" ? "#4CAF50" : "#ff9800"};color:#fff;border:none;border-radius:6px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.2);transition:transform 0.1s;">${getPauseButtonLabel(status)}</button>
        <button type="button" data-testid="go-live-button" style="flex:1;min-width:120px;padding:12px 20px;font:bold 14px;background:#2196F3;color:#fff;border:none;border-radius:6px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.2);transition:transform 0.1s;">Go Live</button>
        <button type="button" data-testid="screenshot-button" style="flex:1;min-width:120px;padding:12px 20px;font:bold 14px;background:#9C27B0;color:#fff;border:none;border-radius:6px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.2);transition:transform 0.1s;">Screenshot</button>
      </div>
      <p data-testid="screenshot-status" style="margin-top:10px;font:12px monospace;color:#777;">Screenshot: idle</p>
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
