import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";

import { isSessionExpired } from "./liveSession";

export interface LiveControlServerOptions {
  port: number;
  sessionTimeoutMs: number;
  onShutdown(): Promise<void>;
}

export interface LiveControlServerHandle {
  close(): Promise<void>;
  heartbeatUrl: string;
}

export async function startLiveControlServer(
  options: LiveControlServerOptions,
): Promise<LiveControlServerHandle> {
  let lastHeartbeatAtMs = Date.now();

  const server = createServer(
    (request: IncomingMessage, response: ServerResponse) => {
      if (request.method === "POST" && request.url === "/heartbeat") {
        lastHeartbeatAtMs = Date.now();
        response.writeHead(204);
        response.end();
        return;
      }

      response.writeHead(404);
      response.end();
    },
  );

  await new Promise<void>((resolvePromise, rejectPromise) => {
    server.once("error", rejectPromise);
    server.listen(options.port, "127.0.0.1", () => {
      resolvePromise();
    });
  });

  const interval = setInterval(() => {
    if (
      !isSessionExpired(lastHeartbeatAtMs, Date.now(), options.sessionTimeoutMs)
    ) {
      return;
    }

    clearInterval(interval);
    void options.onShutdown().finally(() => {
      server.close(() => {
        process.exit(0);
      });
    });
  }, 1000);

  return {
    heartbeatUrl: `http://127.0.0.1:${options.port}/heartbeat`,
    async close() {
      clearInterval(interval);
      await new Promise<void>((resolvePromise, rejectPromise) => {
        server.close((error) => {
          if (error) {
            rejectPromise(error);
            return;
          }
          resolvePromise();
        });
      });
    },
  };
}
