import { describe, expect, it } from "vitest";

import {
  applyPlayerShellState,
  createPlayerShellMarkup,
  getStatusLabel,
} from "../../src/player/playerShell";

describe("playerShell", () => {
  it("renders a player shell with video and required control placeholders", () => {
    const markup = createPlayerShellMarkup("waiting-for-stream");

    expect(markup).toContain("CS 418 Video Surveillance over IP");
    expect(markup).toContain('data-testid="player-video"');
    expect(markup).toContain('data-testid="motion-notification"');
    expect(markup).toContain('data-testid="seek-slider"');
    expect(markup).toContain('data-testid="thumbnail-preview"');
    expect(markup).toContain('data-testid="current-time"');
    expect(markup).toContain('data-testid="live-edge-time"');
    expect(markup).toContain('data-testid="seek-input"');
    expect(markup).toContain('data-testid="seek-button"');
    expect(markup).toContain("Pause");
    expect(markup).toContain("Go Live");
    expect(markup).toContain("Screenshot");
  });

  it("formats the waiting status for the shell", () => {
    expect(getStatusLabel("waiting-for-stream")).toBe(
      "Status: waiting-for-stream",
    );
  });

  it("updates existing shell labels without recreating the video element", () => {
    const elements = {
      statusElement: { textContent: "" },
      pauseButton: { textContent: "" },
    };

    applyPlayerShellState(elements, "paused");

    expect(elements.statusElement.textContent).toBe("Status: paused");
    expect(elements.pauseButton.textContent).toBe("Resume");
  });
});
