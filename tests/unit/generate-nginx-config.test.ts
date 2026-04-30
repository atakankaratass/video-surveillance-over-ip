import { describe, expect, it } from "vitest";

import { generateNginxConfig } from "../../src/server/nginx/generateConfig";
import type { AppConfig } from "../../src/server/config";

const config: AppConfig = {
  paths: {
    outputRoot: "./output",
    dashRoot: "./output/dash",
  },
  capture: {
    inputFormat: "avfoundation",
    inputSource: "0:none",
    frameRate: 30,
    pixelFormat: "uyvy422",
    videoSize: "1280x720",
    audioDevice: null,
  },
  streaming: {
    segmentDurationSeconds: 4,
    dvrWindowSeconds: 120,
  },
  server: {
    host: "127.0.0.1",
    port: 8080,
  },
  motion: {
    enabled: false,
    threshold: 0.2,
  },
  thumbnails: {
    intervalSeconds: 10,
  },
};

describe("generateNginxConfig", () => {
  it("generates a server block using the configured host and port", () => {
    const configText = generateNginxConfig(config, "/workspace/project");

    expect(configText).toContain("listen 8080;");
    expect(configText).toContain("server_name 127.0.0.1;");
  });

  it("serves dash assets and html player content from resolved paths", () => {
    const configText = generateNginxConfig(config, "/workspace/project");

    expect(configText).toContain("root /workspace/project/dist;");
    expect(configText).toContain("alias /workspace/project/output/dash/;");
    expect(configText).toContain("try_files $uri $uri/ /index.html =404;");
  });

  it("quotes nginx paths when the project root contains spaces", () => {
    const configText = generateNginxConfig(
      config,
      "/Users/example/Development/CS 418 Project 2",
    );

    expect(configText).toContain(
      'root "/Users/example/Development/CS 418 Project 2/dist";',
    );
    expect(configText).toContain(
      'alias "/Users/example/Development/CS 418 Project 2/output/dash/";',
    );
  });

  it("declares the expected dash mime types", () => {
    const configText = generateNginxConfig(config, "/workspace/project");

    expect(configText).toContain("application/dash+xml mpd;");
    expect(configText).toContain("video/iso.segment m4s;");
    expect(configText).toContain("text/html html;");
    expect(configText).toContain("application/javascript js;");
    expect(configText).not.toContain("include       mime.types;");
  });
});
