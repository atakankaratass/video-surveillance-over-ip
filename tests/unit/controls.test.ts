import { describe, expect, it } from "vitest";

import {
  formatPlaybackTime,
  getLiveEdgeTime,
  getPauseButtonLabel,
  getSeekTargetTime,
  getSeekValue,
  getToggledPlaybackStatus,
} from "../../src/player/controls";

describe("player controls helpers", () => {
  it("returns Resume when the player is paused", () => {
    expect(getPauseButtonLabel("paused")).toBe("Resume");
  });

  it("returns Pause for live and waiting states", () => {
    expect(getPauseButtonLabel("live")).toBe("Pause");
    expect(getPauseButtonLabel("waiting-for-stream")).toBe("Pause");
  });

  it("toggles paused state back to live", () => {
    expect(getToggledPlaybackStatus("paused")).toBe("live");
    expect(getToggledPlaybackStatus("live")).toBe("paused");
  });

  it("computes the live edge from the final seekable range", () => {
    const seekable = {
      length: 2,
      end(index: number) {
        return index === 0 ? 12 : 48;
      },
    };

    expect(getLiveEdgeTime(seekable)).toBe(48);
  });

  it("returns null when there is no seekable live edge", () => {
    expect(
      getLiveEdgeTime({
        length: 0,
        end: () => 0,
      }),
    ).toBeNull();
  });

  it("maps current time into a slider value within the seekable range", () => {
    expect(getSeekValue(15, 10, 20)).toBe(50);
  });

  it("maps slider percentage back into a target seek time", () => {
    expect(getSeekTargetTime(25, 10, 18)).toBe(12);
  });

  it("formats playback times as mm:ss", () => {
    expect(formatPlaybackTime(0)).toBe("00:00");
    expect(formatPlaybackTime(75)).toBe("01:15");
  });
});
