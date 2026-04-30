const LIVE_MANIFEST_URL = "/dash/live.mpd";

interface DashModuleShape {
  default?: {
    MediaPlayer?: unknown;
  };
  MediaPlayer?: unknown;
}

export function resolveDashModule(module: DashModuleShape): {
  MediaPlayer: {
    (): {
      create(): {
        updateSettings(settings: unknown): void;
        on(event: string, callback: () => void): void;
        initialize(
          element: HTMLVideoElement,
          source: string,
          autoPlay: boolean,
        ): void;
      };
    };
    events: {
      STREAM_INITIALIZED: string;
      ERROR: string;
    };
  };
} {
  if (module.default && module.default.MediaPlayer) {
    return module.default as never;
  }

  if (module.MediaPlayer) {
    return module as never;
  }

  throw new Error("dash.js MediaPlayer export was not found.");
}

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
  const dashjs = resolveDashModule(dashjsModule);
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
