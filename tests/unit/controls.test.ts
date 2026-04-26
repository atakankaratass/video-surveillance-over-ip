import { describe, expect, it } from "vitest";

import {
  getLiveEdgeTime,
  getPauseButtonLabel,
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
});
