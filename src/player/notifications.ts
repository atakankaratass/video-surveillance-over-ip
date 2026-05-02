export interface MotionStatus {
  kind: "motion";
  detected: boolean;
  score: number;
}

export async function loadMotionStatus(
  fetchFn: typeof fetch,
  url = "/dash/motion/status.json",
): Promise<MotionStatus | null> {
  const response = await fetchFn(url);

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as MotionStatus;
}
