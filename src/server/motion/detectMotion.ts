export function calculateMotionScore(
  previousFrame: Uint8Array,
  currentFrame: Uint8Array,
): number {
  if (
    previousFrame.length !== currentFrame.length ||
    previousFrame.length === 0
  ) {
    return 0;
  }

  let totalDifference = 0;

  for (let index = 0; index < previousFrame.length; index += 1) {
    totalDifference += Math.abs(previousFrame[index]! - currentFrame[index]!);
  }

  return totalDifference / previousFrame.length / 255;
}

export function isMotionDetected(score: number, threshold: number): boolean {
  return score > threshold;
}
