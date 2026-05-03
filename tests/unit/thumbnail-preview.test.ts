import { describe, expect, it } from "vitest";

import {
  getThumbnailPreviewState,
  type ThumbnailPreviewMetadata,
} from "../../src/player/thumbnails";

const metadata: ThumbnailPreviewMetadata = {
  imageUrl: "/thumbnails/sprite.jpg",
  entries: [
    { timeSeconds: 0, x: 0, y: 0, width: 160, height: 90 },
    { timeSeconds: 15, x: 160, y: 0, width: 160, height: 90 },
    { timeSeconds: 30, x: 320, y: 0, width: 160, height: 90 },
  ],
};

describe("thumbnail preview state", () => {
  it("hides preview when metadata is unavailable", () => {
    expect(getThumbnailPreviewState(null, 25, 0, 30)).toEqual({
      visible: false,
    });
  });

  it("returns visible preview data for a hover position", () => {
    expect(getThumbnailPreviewState(metadata, 50, 0, 30)).toEqual({
      visible: true,
      imageUrl: "/thumbnails/sprite.jpg",
      x: 160,
      y: 0,
      width: 160,
      height: 90,
      timeSeconds: 15,
      formattedTime: "00:15",
    });
  });

  it("loads metadata without relying on browser cache", async () => {
    const fetchFn = async (
      input: string | URL | Request,
      init?: RequestInit,
    ): Promise<Response> => {
      expect(input).toBe("/dash/thumbnails/metadata.json");
      expect(init).toMatchObject({ cache: "no-store" });

      return new Response(JSON.stringify(metadata), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const result = await import("../../src/player/thumbnails").then((module) =>
      module.loadThumbnailMetadata(fetchFn as typeof fetch),
    );

    expect(result).toEqual(metadata);
  });
});
