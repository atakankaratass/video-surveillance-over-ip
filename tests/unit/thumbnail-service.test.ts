import { describe, expect, it } from "vitest";

import {
  buildSpriteCommandArgs,
  getThumbnailFrameCount,
  selectThumbnailSourceSegments,
} from "../../src/server/thumbnails/service";

describe("thumbnail service", () => {
  it("derives thumbnail frame count from the DVR window and preview interval", () => {
    expect(getThumbnailFrameCount(120, 5)).toBe(25);
    expect(getThumbnailFrameCount(120, 60)).toBe(3);
  });

  it("selects chronologically sorted thumbnails across the available history", async () => {
    expect(
      await selectThumbnailSourceSegments(
        [
          "chunk-stream0-1.m4s",
          "chunk-stream0-10.m4s",
          "chunk-stream0-2.m4s",
          "chunk-stream0-5.m4s",
          "chunk-stream0-7.m4s",
          "chunk-stream1-2.m4s",
          "chunk-stream0-9.m4s",
        ],
        3,
      ),
    ).toEqual([
      "chunk-stream0-1.m4s",
      "chunk-stream0-5.m4s",
      "chunk-stream0-9.m4s",
    ]);
  });

  it("builds a direct sprite output command when only one frame exists", () => {
    expect(buildSpriteCommandArgs(["frame-0.jpg"], "sprite.jpg")).toEqual([
      "-hide_banner",
      "-y",
      "-i",
      "frame-0.jpg",
      "-frames:v",
      "1",
      "sprite.jpg",
    ]);
  });
});
