import { resolve } from "node:path";

import type { AppConfig } from "../config";

export function generateNginxConfig(
  config: AppConfig,
  projectRoot: string,
): string {
  const dashRoot = resolve(projectRoot, config.paths.dashRoot);
  const frontendRoot = resolve(projectRoot, "dist");
  const rootDirective = frontendRoot.includes(" ")
    ? `"${frontendRoot}"`
    : frontendRoot;
  const dashDirective = dashRoot.includes(" ")
    ? `"${dashRoot}/"`
    : `${dashRoot}/`;

  return `worker_processes  1;

events {
  worker_connections  1024;
}

http {
  default_type  application/octet-stream;

  types {
    text/html html;
    text/css css;
    application/javascript js;
    application/dash+xml mpd;
    video/iso.segment m4s;
  }

  server {
    listen ${config.server.port};
    server_name ${config.server.host};
    root ${rootDirective};

    location /dash/ {
      alias ${dashDirective};
      add_header Cache-Control no-cache;
    }

    location / {
      try_files $uri $uri/ /index.html =404;
    }
  }
}
`;
}
