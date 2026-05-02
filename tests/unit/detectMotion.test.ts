import { describe, expect, it } from "vitest";

import {
  calculateMotionScore,
  isMotionDetected,
} from "../../src/server/motion/detectMotion";

describe("detectMotion", () => {
  it("returns zero difference for identical frames", () => {
    const frame = new Uint8Array([0, 10, 20, 30]);

    expect(calculateMotionScore(frame, frame)).toBe(0);
  });

  it("returns a normalized average difference score", () => {
    const previous = new Uint8Array([0, 0, 0, 0]);
    const current = new Uint8Array([255, 255, 255, 255]);

    expect(calculateMotionScore(previous, current)).toBe(1);
  });

  it("detects motion when score exceeds threshold", () => {
    expect(isMotionDetected(0.3, 0.2)).toBe(true);
    expect(isMotionDetected(0.1, 0.2)).toBe(false);
  });
});
