import { resolve } from "node:path";

import type { AppConfig } from "../config";

export function generateNginxConfig(
  config: AppConfig,
  projectRoot: string,
): string {
  const dashRoot = resolve(projectRoot, config.paths.dashRoot);

  return `worker_processes  1;

events {
  worker_connections  1024;
}

http {
  include       mime.types;
  default_type  application/octet-stream;

  types {
    application/dash+xml mpd;
    video/iso.segment m4s;
  }

  server {
    listen ${config.server.port};
    server_name ${config.server.host};
    root ${projectRoot};

    location /dash/ {
      alias ${dashRoot}/;
      add_header Cache-Control no-cache;
    }

    location / {
      try_files $uri /index.html;
    }
  }
}
`;
}
