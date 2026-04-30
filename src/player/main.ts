import {
  formatPlaybackTime,
  getLiveEdgeTime,
  getSeekTargetTime,
  getSeekValue,
  getToggledPlaybackStatus,
} from "./controls";
import { initializeDashPlayback } from "./dashPlayback";
import { startLiveHeartbeat } from "./liveHeartbeat";
import {
  applyPlayerShellState,
  createPlayerShellMarkup,
  type PlayerStatus,
} from "./playerShell";
import { captureScreenshot } from "./screenshot";

const appElement = document.querySelector<HTMLDivElement>("#app");

if (!appElement) {
  throw new Error("App root element was not found.");
}

const rootElement = appElement;
let currentStatus: PlayerStatus = "waiting-for-stream";

rootElement.innerHTML = createPlayerShellMarkup(currentStatus);

const videoElement = rootElement.querySelector<HTMLVideoElement>(
  '[data-testid="player-video"]',
);
const statusElement = rootElement.querySelector<HTMLParagraphElement>(
  '[data-testid="player-status"]',
);
const pauseButton = rootElement.querySelector<HTMLButtonElement>(
  '[data-testid="pause-button"]',
);
const goLiveButton = rootElement.querySelector<HTMLButtonElement>(
  '[data-testid="go-live-button"]',
);
const screenshotButton = rootElement.querySelector<HTMLButtonElement>(
  '[data-testid="screenshot-button"]',
);
const screenshotStatus = rootElement.querySelector<HTMLParagraphElement>(
  '[data-testid="screenshot-status"]',
);
const currentTimeElement = rootElement.querySelector<HTMLParagraphElement>(
  '[data-testid="current-time"]',
);
const liveEdgeTimeElement = rootElement.querySelector<HTMLParagraphElement>(
  '[data-testid="live-edge-time"]',
);
const seekSlider = rootElement.querySelector<HTMLInputElement>(
  '[data-testid="seek-slider"]',
);
const seekInput = rootElement.querySelector<HTMLInputElement>(
  '[data-testid="seek-input"]',
);
const seekButton = rootElement.querySelector<HTMLButtonElement>(
  '[data-testid="seek-button"]',
);

if (
  !videoElement ||
  !statusElement ||
  !pauseButton ||
  !goLiveButton ||
  !screenshotButton ||
  !screenshotStatus ||
  !currentTimeElement ||
  !liveEdgeTimeElement ||
  !seekSlider ||
  !seekInput ||
  !seekButton
) {
  throw new Error("Player shell elements were not found.");
}

const playerVideoElement = videoElement;
const playerStatusElement = statusElement;
const playerPauseButton = pauseButton;
const playerGoLiveButton = goLiveButton;
const playerScreenshotButton = screenshotButton;
const playerScreenshotStatus = screenshotStatus;
const playerCurrentTimeElement = currentTimeElement;
const playerLiveEdgeTimeElement = liveEdgeTimeElement;
const playerSeekSlider = seekSlider;
const playerSeekInput = seekInput;
const playerSeekButton = seekButton;
const heartbeatUrl = `http://${window.location.hostname}:8091/heartbeat`;

function applyStatus(status: PlayerStatus): void {
  currentStatus = status;
  applyPlayerShellState(
    {
      statusElement: playerStatusElement,
      pauseButton: playerPauseButton,
    },
    status,
  );
}

function updateSeekUi(): void {
  const liveEdgeTime = getLiveEdgeTime(playerVideoElement.seekable);

  playerCurrentTimeElement.textContent = formatPlaybackTime(
    playerVideoElement.currentTime,
  );
  playerLiveEdgeTimeElement.textContent = formatPlaybackTime(liveEdgeTime ?? 0);

  if (liveEdgeTime === null) {
    playerSeekSlider.value = "100";
    return;
  }

  const rangeStart = Math.max(0, liveEdgeTime - 30);
  playerSeekSlider.value = String(
    getSeekValue(playerVideoElement.currentTime, rangeStart, liveEdgeTime),
  );
}

playerPauseButton.addEventListener("click", () => {
  const nextStatus = getToggledPlaybackStatus(currentStatus);

  if (nextStatus === "paused") {
    playerVideoElement.pause();
  } else {
    void playerVideoElement.play().catch(() => undefined);
  }

  applyStatus(nextStatus);
});

playerGoLiveButton.addEventListener("click", () => {
  const liveEdgeTime = getLiveEdgeTime(playerVideoElement.seekable);

  if (liveEdgeTime !== null) {
    playerVideoElement.currentTime = liveEdgeTime;
  }

  void playerVideoElement.play().catch(() => undefined);
  applyStatus("live");
  updateSeekUi();
});

playerSeekSlider.addEventListener("input", () => {
  const liveEdgeTime = getLiveEdgeTime(playerVideoElement.seekable);

  if (liveEdgeTime === null) {
    return;
  }

  const rangeStart = Math.max(0, liveEdgeTime - 30);
  const targetTime = getSeekTargetTime(
    Number(playerSeekSlider.value),
    rangeStart,
    liveEdgeTime,
  );

  playerVideoElement.currentTime = targetTime;
  playerSeekInput.value = Math.round(targetTime).toString();
  applyStatus("paused");
  updateSeekUi();
});

playerSeekButton.addEventListener("click", () => {
  const requestedSeconds = Number(playerSeekInput.value);

  if (Number.isNaN(requestedSeconds) || requestedSeconds < 0) {
    return;
  }

  playerVideoElement.currentTime = requestedSeconds;
  applyStatus("paused");
  updateSeekUi();
});

playerScreenshotButton.addEventListener("click", () => {
  try {
    const result = captureScreenshot<HTMLVideoElement>(playerVideoElement, {
      now: () => new Date(),
      createCanvas: () => document.createElement("canvas"),
      createDownloadLink: () => document.createElement("a"),
    });
    playerScreenshotStatus.textContent = `Screenshot status: saved ${result.fileName}`;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Screenshot failed.";
    playerScreenshotStatus.textContent = `Screenshot status: ${message}`;
  }
});

applyStatus(currentStatus);
updateSeekUi();

if (heartbeatUrl) {
  startLiveHeartbeat(heartbeatUrl);
}

playerVideoElement.addEventListener("timeupdate", () => {
  updateSeekUi();
});

playerVideoElement.addEventListener("pause", () => {
  if (currentStatus !== "paused") {
    applyStatus("paused");
  }
});

playerVideoElement.addEventListener("play", () => {
  if (currentStatus === "paused") {
    applyStatus("live");
  }
});

initializeDashPlayback(playerVideoElement, {
  onConnecting() {
    applyStatus("connecting");
  },
  onLive() {
    void playerVideoElement.play().catch(() => undefined);
    applyStatus("live");
  },
  onError() {
    applyStatus("waiting-for-stream");
  },
});
