import { describe, expect, it, vi } from "vitest";

import {
  createScreenshotFilename,
  captureScreenshot,
} from "../../src/player/screenshot";

describe("screenshot helpers", () => {
  it("creates a stable filename format", () => {
    const fileName = createScreenshotFilename(new Date("2026-04-26T11:22:33Z"));

    expect(fileName).toBe("surveillance-2026-04-26T11-22-33-000Z.png");
  });

  it("captures a screenshot through the provided canvas dependencies", () => {
    const drawImage = vi.fn();
    const toDataURL = vi.fn(() => "data:image/png;base64,abc123");
    const click = vi.fn();

    const result = captureScreenshot(
      {
        videoWidth: 640,
        videoHeight: 360,
      },
      {
        now: () => new Date("2026-04-26T11:22:33Z"),
        createCanvas: () => ({
          width: 0,
          height: 0,
          getContext: () => ({ drawImage }),
          toDataURL,
        }),
        createDownloadLink: () => ({
          href: "",
          download: "",
          click,
        }),
      },
    );

    expect(result.fileName).toBe("surveillance-2026-04-26T11-22-33-000Z.png");
    expect(result.dataUrl).toBe("data:image/png;base64,abc123");
    expect(drawImage).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
  });

  it("rejects screenshots when the video has no frame size", () => {
    expect(() =>
      captureScreenshot(
        {
          videoWidth: 0,
          videoHeight: 0,
        },
        {
          now: () => new Date(),
          createCanvas: () => {
            throw new Error("should not be called");
          },
          createDownloadLink: () => {
            throw new Error("should not be called");
          },
        },
      ),
    ).toThrow("Cannot capture screenshot before video metadata is available.");
  });
});
