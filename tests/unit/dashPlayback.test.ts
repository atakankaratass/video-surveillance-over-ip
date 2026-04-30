import { describe, expect, it } from "vitest";

import { resolveDashModule } from "../../src/player/dashPlayback";

describe("resolveDashModule", () => {
  it("uses the default export when MediaPlayer exists there", () => {
    const resolved = resolveDashModule({
      default: {
        MediaPlayer: "default-player",
      },
    });

    expect(resolved.MediaPlayer).toBe("default-player");
  });

  it("falls back to the top-level module export when needed", () => {
    const resolved = resolveDashModule({
      MediaPlayer: "top-level-player",
    });

    expect(resolved.MediaPlayer).toBe("top-level-player");
  });

  it("throws a clear error when MediaPlayer cannot be found", () => {
    expect(() => resolveDashModule({})).toThrowError(
      "dash.js MediaPlayer export was not found.",
    );
  });
});
