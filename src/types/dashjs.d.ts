declare module "dashjs" {
  interface DashPlayerInstance {
    updateSettings(settings: unknown): void;
    on(event: string, callback: () => void): void;
    initialize(
      element: HTMLVideoElement,
      source: string,
      autoPlay: boolean,
    ): void;
  }

  type DashMediaPlayerFactory = (() => {
    create(): DashPlayerInstance;
  }) & {
    events: {
      STREAM_INITIALIZED: string;
      ERROR: string;
    };
  };

  const dashjs: {
    MediaPlayer: DashMediaPlayerFactory;
  };

  export default dashjs;
}
