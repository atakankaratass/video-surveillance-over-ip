import {
  formatPlaybackTime,
  getLiveEdgeTime,
  getSeekRange,
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
import { loadMotionStatus } from "./notifications";
import { captureScreenshot } from "./screenshot";
import {
  getThumbnailPreviewState,
  loadThumbnailMetadata,
  type ThumbnailPreviewMetadata,
} from "./thumbnails";

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
const rewindButton = rootElement.querySelector<HTMLButtonElement>(
  '[data-testid="rewind-button"]',
);
const forwardButton = rootElement.querySelector<HTMLButtonElement>(
  '[data-testid="forward-button"]',
);
const screenshotButton = rootElement.querySelector<HTMLButtonElement>(
  '[data-testid="screenshot-button"]',
);
const screenshotStatus = rootElement.querySelector<HTMLParagraphElement>(
  '[data-testid="screenshot-status"]',
);
const motionNotification = rootElement.querySelector<HTMLParagraphElement>(
  '[data-testid="motion-notification"]',
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
const thumbnailPreview = rootElement.querySelector<HTMLDivElement>(
  '[data-testid="thumbnail-preview"]',
);
const thumbnailLabel = rootElement.querySelector<HTMLDivElement>(
  '[data-testid="thumbnail-label"]',
);

if (
  !videoElement ||
  !statusElement ||
  !pauseButton ||
  !goLiveButton ||
  !rewindButton ||
  !forwardButton ||
  !screenshotButton ||
  !motionNotification ||
  !screenshotStatus ||
  !currentTimeElement ||
  !liveEdgeTimeElement ||
  !seekSlider ||
  !seekInput ||
  !seekButton ||
  !thumbnailPreview ||
  !thumbnailLabel
) {
  throw new Error("Player shell elements were not found.");
}

const playerVideoElement = videoElement;
const playerStatusElement = statusElement;
const playerPauseButton = pauseButton;
const playerGoLiveButton = goLiveButton;
const playerRewindButton = rewindButton;
const playerForwardButton = forwardButton;
const playerScreenshotButton = screenshotButton;
const playerMotionNotification = motionNotification;
const playerScreenshotStatus = screenshotStatus;
const playerCurrentTimeElement = currentTimeElement;
const playerLiveEdgeTimeElement = liveEdgeTimeElement;
const playerSeekSlider = seekSlider;
const playerSeekInput = seekInput;
const playerSeekButton = seekButton;
const playerThumbnailPreview = thumbnailPreview;
const playerThumbnailLabel = thumbnailLabel;
const heartbeatUrl = `http://${window.location.hostname}:8091/heartbeat`;
let thumbnailMetadata: ThumbnailPreviewMetadata | null = null;

async function refreshThumbnailMetadata(): Promise<void> {
  try {
    const result = await loadThumbnailMetadata(window.fetch.bind(window));
    if (result) {
      thumbnailMetadata = result;
    }
  } catch {
    // Ignore fetch errors (e.g. 404 before generated)
  }
}

void refreshThumbnailMetadata();
window.setInterval(() => {
  void refreshThumbnailMetadata();
}, 10000);

function applyMotionNotification(detected: boolean): void {
  if (!detected) {
    playerMotionNotification.hidden = true;
    playerMotionNotification.style.display = "none";
    return;
  }

  playerMotionNotification.hidden = false;
  playerMotionNotification.style.display = "block";
  playerMotionNotification.textContent = "Motion detected";
}

function refreshMotionNotification(): void {
  void loadMotionStatus(window.fetch.bind(window)).then((result) => {
    applyMotionNotification(result?.detected ?? false);
  });
}

refreshMotionNotification();
window.setInterval(refreshMotionNotification, 2000);

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
  const seekRange = getSeekRange(playerVideoElement.seekable);
  const liveEdgeTime = seekRange?.end ?? null;

  playerCurrentTimeElement.textContent = formatPlaybackTime(
    playerVideoElement.currentTime,
  );
  playerLiveEdgeTimeElement.textContent = formatPlaybackTime(liveEdgeTime ?? 0);

  if (liveEdgeTime === null) {
    playerSeekSlider.value = "100";
    return;
  }

  playerSeekSlider.value = String(
    getSeekValue(
      playerVideoElement.currentTime,
      seekRange?.start ?? 0,
      liveEdgeTime,
    ),
  );
}

playerPauseButton.addEventListener("click", () => {
  const nextStatus = getToggledPlaybackStatus(currentStatus);

  if (nextStatus === "paused") {
    playerVideoElement.pause();
    applyStatus("paused");
  } else {
    // When resuming, check current position
    const liveEdgeTime = getLiveEdgeTime(playerVideoElement.seekable);
    const isAtLiveEdge =
      liveEdgeTime !== null &&
      Math.abs(playerVideoElement.currentTime - liveEdgeTime) < 2;

    if (!isAtLiveEdge) {
      // Not at live edge - just resume from where we are
      playerVideoElement.play().catch(() => undefined);
      applyStatus("live");
    } else {
      // At live edge - can resume normally
      playerVideoElement.play().catch(() => undefined);
      applyStatus("live");
    }
  }
  updateSeekUi();
});

playerGoLiveButton.addEventListener("click", () => {
  const liveEdgeTime = getLiveEdgeTime(playerVideoElement.seekable);

  if (liveEdgeTime !== null) {
    // Go 6 seconds before live edge to avoid freezing (buffer time)
    const targetTime = Math.max(0, liveEdgeTime - 6);
    playerVideoElement.currentTime = targetTime;
  }
  applyStatus("live");
  updateSeekUi();
});

playerRewindButton.addEventListener("click", () => {
  const liveEdgeTime = getLiveEdgeTime(playerVideoElement.seekable);
  if (liveEdgeTime === null) return;

  const newTime = Math.max(0, playerVideoElement.currentTime - 10);
  playerVideoElement.currentTime = newTime;
  playerSeekInput.value = Math.round(newTime).toString();
  updateSeekUi();
});

playerForwardButton.addEventListener("click", () => {
  const liveEdgeTime = getLiveEdgeTime(playerVideoElement.seekable);
  if (liveEdgeTime === null) return;

  const newTime = Math.min(liveEdgeTime, playerVideoElement.currentTime + 10);
  playerVideoElement.currentTime = newTime;
  playerSeekInput.value = Math.round(newTime).toString();
  updateSeekUi();
});

playerSeekSlider.addEventListener("input", () => {
  const seekRange = getSeekRange(playerVideoElement.seekable);
  const liveEdgeTime = seekRange?.end ?? null;

  if (liveEdgeTime === null) {
    return;
  }

  const targetTime = getSeekTargetTime(
    Number(playerSeekSlider.value),
    seekRange?.start ?? 0,
    liveEdgeTime,
  );

  playerVideoElement.currentTime = targetTime;
  playerSeekInput.value = Math.round(targetTime).toString();
  // Don't auto-pause - user can seek while playing
  updateSeekUi();
});

playerSeekButton.addEventListener("click", () => {
  const requestedSeconds = Number(playerSeekInput.value);

  if (Number.isNaN(requestedSeconds) || requestedSeconds < 0) {
    return;
  }

  playerVideoElement.currentTime = requestedSeconds;
  // Don't auto-pause - user can seek while playing
  updateSeekUi();
});

playerSeekSlider.addEventListener("mousemove", (event) => {
  const seekRange = getSeekRange(playerVideoElement.seekable);
  const liveEdgeTime = seekRange?.end ?? null;

  if (liveEdgeTime === null) {
    return;
  }

  const rect = playerSeekSlider.getBoundingClientRect();
  const hoverPercentage = ((event.clientX - rect.left) / rect.width) * 100;
  const previewState = getThumbnailPreviewState(
    thumbnailMetadata,
    hoverPercentage,
    seekRange?.start ?? 0,
    liveEdgeTime,
  );

  if (!previewState.visible) {
    playerThumbnailPreview.hidden = true;
    playerThumbnailPreview.style.display = "none";
    playerThumbnailLabel.hidden = true;
    playerThumbnailLabel.style.display = "none";
    return;
  }

  playerThumbnailPreview.hidden = false;
  playerThumbnailPreview.style.display = "block";
  playerThumbnailPreview.style.backgroundImage = `url(${previewState.imageUrl})`;
  playerThumbnailPreview.style.backgroundPosition = `-${previewState.x}px -${previewState.y}px`;
  playerThumbnailLabel.hidden = false;
  playerThumbnailLabel.style.display = "block";
  playerThumbnailLabel.textContent = previewState.formattedTime;
});

playerSeekSlider.addEventListener("mouseleave", () => {
  playerThumbnailPreview.hidden = true;
  playerThumbnailPreview.style.display = "none";
  playerThumbnailLabel.hidden = true;
  playerThumbnailLabel.style.display = "none";
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
