export interface ScreenshotVideoSource {
  videoWidth: number;
  videoHeight: number;
}

export interface ScreenshotCanvasContext<VideoSource> {
  drawImage(video: VideoSource, x: number, y: number): void;
}

export interface ScreenshotCanvas<VideoSource> {
  width: number;
  height: number;
  getContext(type: "2d"): ScreenshotCanvasContext<VideoSource> | null;
  toDataURL(type: "image/png"): string;
}

export interface ScreenshotDownloadLink {
  href: string;
  download: string;
  click(): void;
}

export interface ScreenshotDependencies<VideoSource> {
  now(): Date;
  createCanvas(): ScreenshotCanvas<VideoSource>;
  createDownloadLink(): ScreenshotDownloadLink;
}

export interface ScreenshotResult {
  fileName: string;
  dataUrl: string;
}

export function createScreenshotFilename(date: Date): string {
  return `surveillance-${date.toISOString().replaceAll(":", "-").replaceAll(".", "-")}.png`;
}

export function captureScreenshot<VideoSource extends ScreenshotVideoSource>(
  video: VideoSource,
  dependencies: ScreenshotDependencies<VideoSource>,
): ScreenshotResult {
  if (video.videoWidth <= 0 || video.videoHeight <= 0) {
    throw new Error(
      "Cannot capture screenshot before video metadata is available.",
    );
  }

  const canvas = dependencies.createCanvas();
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create a 2D canvas context.");
  }

  context.drawImage(video, 0, 0);

  const dataUrl = canvas.toDataURL("image/png");
  const fileName = createScreenshotFilename(dependencies.now());
  const link = dependencies.createDownloadLink();
  link.href = dataUrl;
  link.download = fileName;
  link.click();

  return {
    fileName,
    dataUrl,
  };
}
