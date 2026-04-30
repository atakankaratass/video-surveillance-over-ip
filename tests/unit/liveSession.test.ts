import { describe, expect, it } from "vitest";

import { isSessionExpired } from "../../src/server/liveSession";

describe("isSessionExpired", () => {
  it("returns false when the heartbeat is still fresh", () => {
    expect(isSessionExpired(1_000, 5_000, 5_000)).toBe(false);
  });

  it("returns true when the heartbeat is older than the timeout", () => {
    expect(isSessionExpired(1_000, 7_001, 5_000)).toBe(true);
  });
});
