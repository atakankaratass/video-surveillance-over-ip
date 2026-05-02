import { describe, expect, it } from "vitest";

import {
  buildSpriteCommandArgs,
  selectThumbnailSourceSegments,
} from "../../src/server/thumbnails/service";

describe("thumbnail service", () => {
  it("selects up to three latest baseline video chunks in chronological order", () => {
    expect(
      selectThumbnailSourceSegments(
        [
          "chunk-stream0-00001.m4s",
          "chunk-stream0-00004.m4s",
          "chunk-stream0-00002.m4s",
          "chunk-stream1-00002.m4s",
          "chunk-stream0-00003.m4s",
        ],
        3,
      ),
    ).toEqual([
      "chunk-stream0-00002.m4s",
      "chunk-stream0-00003.m4s",
      "chunk-stream0-00004.m4s",
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
