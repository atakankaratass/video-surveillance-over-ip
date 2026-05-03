import { describe, expect, it } from "vitest";

import {
  buildSpriteMetadata,
  findClosestThumbnailEntry,
  type ThumbnailMetadata,
} from "../../src/server/thumbnails/metadata";

const metadata: ThumbnailMetadata = {
  imageUrl: "/thumbnails/sprite.jpg",
  entries: [
    { timeSeconds: 0, x: 0, y: 0, width: 160, height: 90 },
    { timeSeconds: 10, x: 160, y: 0, width: 160, height: 90 },
    { timeSeconds: 20, x: 320, y: 0, width: 160, height: 90 },
  ],
};

describe("thumbnail metadata", () => {
  it("selects the closest thumbnail entry for a target time", () => {
    expect(findClosestThumbnailEntry(metadata.entries, 14)).toEqual(
      metadata.entries[1],
    );
  });

  it("returns null when no thumbnail entries exist", () => {
    expect(findClosestThumbnailEntry([], 14)).toBeNull();
  });

  it("builds horizontal sprite metadata for a fixed frame count", () => {
    expect(
      buildSpriteMetadata({
        imageUrl: "/dash/thumbnails/sprite.jpg",
        frameWidth: 160,
        frameHeight: 90,
        entryTimesSeconds: [0, 10, 20],
      }),
    ).toEqual({
      imageUrl: "/dash/thumbnails/sprite.jpg",
      entries: [
        { timeSeconds: 0, x: 0, y: 0, width: 160, height: 90 },
        { timeSeconds: 10, x: 160, y: 0, width: 160, height: 90 },
        { timeSeconds: 20, x: 320, y: 0, width: 160, height: 90 },
      ],
    });
  });

  it("preserves explicit thumbnail times for a mature live window", () => {
    expect(
      buildSpriteMetadata({
        imageUrl: "/dash/thumbnails/sprite.jpg",
        frameWidth: 160,
        frameHeight: 90,
        entryTimesSeconds: [280, 300, 320],
      }),
    ).toEqual({
      imageUrl: "/dash/thumbnails/sprite.jpg",
      entries: [
        { timeSeconds: 280, x: 0, y: 0, width: 160, height: 90 },
        { timeSeconds: 300, x: 160, y: 0, width: 160, height: 90 },
        { timeSeconds: 320, x: 320, y: 0, width: 160, height: 90 },
      ],
    });
  });
});
