import { getLiveEdgeTime, getToggledPlaybackStatus } from "./controls";
import { initializeDashPlayback } from "./dashPlayback";
import { createPlayerShellMarkup, type PlayerStatus } from "./playerShell";
import { captureScreenshot } from "./screenshot";

const appElement = document.querySelector<HTMLDivElement>("#app");

if (!appElement) {
  throw new Error("App root element was not found.");
}

const rootElement = appElement;
let currentStatus: PlayerStatus = "waiting-for-stream";

function render(status: PlayerStatus): HTMLVideoElement {
  currentStatus = status;
  rootElement.innerHTML = createPlayerShellMarkup(status);

  const videoElement = rootElement.querySelector<HTMLVideoElement>(
    '[data-testid="player-video"]',
  );

  if (!videoElement) {
    throw new Error("Player video element was not found.");
  }

  return videoElement;
}

function bindControls(videoElement: HTMLVideoElement): void {
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

  if (!pauseButton || !goLiveButton || !screenshotButton || !screenshotStatus) {
    throw new Error("Player controls were not found.");
  }

  pauseButton.addEventListener("click", () => {
    const nextVideoElement = render(getToggledPlaybackStatus(currentStatus));
    bindControls(nextVideoElement);
  });

  goLiveButton.addEventListener("click", () => {
    const liveEdgeTime = getLiveEdgeTime(videoElement.seekable);

    if (liveEdgeTime !== null) {
      videoElement.currentTime = liveEdgeTime;
    }

    const nextVideoElement = render("live");
    bindControls(nextVideoElement);
  });

  screenshotButton.addEventListener("click", () => {
    try {
      const result = captureScreenshot<HTMLVideoElement>(videoElement, {
        now: () => new Date(),
        createCanvas: () => document.createElement("canvas"),
        createDownloadLink: () => document.createElement("a"),
      });
      screenshotStatus.textContent = `Screenshot status: saved ${result.fileName}`;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Screenshot failed.";
      screenshotStatus.textContent = `Screenshot status: ${message}`;
    }
  });
}

const videoElement = render(currentStatus);
bindControls(videoElement);

initializeDashPlayback(videoElement, {
  onConnecting() {
    const nextVideoElement = render("connecting");
    bindControls(nextVideoElement);
  },
  onLive() {
    const nextVideoElement = render("live");
    bindControls(nextVideoElement);
  },
  onError() {
    const nextVideoElement = render("waiting-for-stream");
    bindControls(nextVideoElement);
  },
});
