import { describe, expect, it } from "vitest";

import {
  createPlayerShellMarkup,
  getStatusLabel,
} from "../../src/player/playerShell";

describe("playerShell", () => {
  it("renders a player shell with video and required control placeholders", () => {
    const markup = createPlayerShellMarkup("waiting-for-stream");

    expect(markup).toContain("CS 418 Video Surveillance over IP");
    expect(markup).toContain('data-testid="player-video"');
    expect(markup).toContain("Pause");
    expect(markup).toContain("Go Live");
    expect(markup).toContain("Screenshot");
  });

  it("formats the waiting status for the shell", () => {
    expect(getStatusLabel("waiting-for-stream")).toBe(
      "Player status: waiting-for-stream",
    );
  });
});
