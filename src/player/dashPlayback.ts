const LIVE_MANIFEST_URL = "/dash/live.mpd";

export interface DashPlaybackBindings {
  onConnecting(): void;
  onLive(): void;
  onError(): void;
}

export async function initializeDashPlayback(
  videoElement: HTMLVideoElement,
  bindings: DashPlaybackBindings,
): Promise<void> {
  const dashjsModule = await import("dashjs");
  const dashjs = dashjsModule.default;
  const player = dashjs.MediaPlayer().create();
  player.updateSettings({
    streaming: {
      delay: {
        liveDelayFragmentCount: 2,
      },
    },
  });

  player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
    bindings.onLive();
  });

  player.on(dashjs.MediaPlayer.events.ERROR, () => {
    bindings.onError();
  });

  player.initialize(videoElement, LIVE_MANIFEST_URL, false);
}
