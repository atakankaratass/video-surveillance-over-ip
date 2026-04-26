import { initializeDashPlayback } from "./dashPlayback";
import { createPlayerShellMarkup, type PlayerStatus } from "./playerShell";

const appElement = document.querySelector<HTMLDivElement>("#app");

if (!appElement) {
  throw new Error("App root element was not found.");
}

const rootElement = appElement;

function render(status: PlayerStatus): HTMLVideoElement {
  rootElement.innerHTML = createPlayerShellMarkup(status);

  const videoElement = rootElement.querySelector<HTMLVideoElement>(
    '[data-testid="player-video"]',
  );

  if (!videoElement) {
    throw new Error("Player video element was not found.");
  }

  return videoElement;
}

const videoElement = render("waiting-for-stream");

initializeDashPlayback(videoElement, {
  onConnecting() {
    render("connecting");
  },
  onLive() {
    render("live");
  },
  onError() {
    render("waiting-for-stream");
  },
});
