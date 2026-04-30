export function isSessionExpired(
  lastHeartbeatAtMs: number,
  nowMs: number,
  timeoutMs: number,
): boolean {
  return nowMs - lastHeartbeatAtMs > timeoutMs;
}
