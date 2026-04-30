export function startLiveHeartbeat(heartbeatUrl: string): () => void {
  const sendHeartbeat = (): void => {
    void fetch(heartbeatUrl, {
      method: "POST",
      keepalive: true,
    }).catch(() => undefined);
  };

  sendHeartbeat();
  const interval = window.setInterval(sendHeartbeat, 2000);

  window.addEventListener("beforeunload", sendHeartbeat);

  return () => {
    window.clearInterval(interval);
    window.removeEventListener("beforeunload", sendHeartbeat);
  };
}
