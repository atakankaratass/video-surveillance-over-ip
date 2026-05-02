export interface MotionStatusEvent {
  kind: "motion";
  detected: boolean;
  score: number;
}

export function buildMotionStatusEvent(input: {
  detected: boolean;
  score: number;
}): MotionStatusEvent {
  return {
    kind: "motion",
    detected: input.detected,
    score: input.score,
  };
}
