import { describe, expect, it } from "vitest";

import { buildMotionStatusEvent } from "../../src/server/notifications/events";

describe("motion service", () => {
  it("builds a motion status event payload", () => {
    expect(buildMotionStatusEvent({ detected: true, score: 0.4 })).toEqual({
      detected: true,
      score: 0.4,
      kind: "motion",
    });
  });
});
