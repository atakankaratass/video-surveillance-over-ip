import { describe, expect, it } from "vitest";

describe("audio ffmpeg config file", () => {
  it("exists and documents the AAC audio pipeline settings", async () => {
    const configText = await import("../../configs/ffmpeg/audio.json", {
      with: { type: "json" },
    }).then((module) => module.default);

    expect(configText.audioCodec).toBe("aac");
    expect(configText.manifestName).toBe("live-audio.mpd");
  });
});
