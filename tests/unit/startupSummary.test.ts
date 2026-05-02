import { describe, expect, it } from "vitest";

import { formatStartupSummary } from "../../src/server/startupSummary";
import type { StartupPlan } from "../../src/server/startupPlan";

const startupPlan: StartupPlan = {
  ffmpeg: {
    command: "ffmpeg",
    args: ["-hide_banner", "-y"],
    manifestPath: "./output/dash/live.mpd",
  },
  nginx: {
    command: "nginx",
    args: ["-c", "/workspace/project/configs/nginx/generated.conf"],
  },
  playerUrl: "http://127.0.0.1:8080",
  manifestUrl: "http://127.0.0.1:8080/dash/live.mpd",
  audioEnabled: false,
  abrEnabled: false,
};

describe("formatStartupSummary", () => {
  it("includes the key URLs and generated file locations", () => {
    const summary = formatStartupSummary(
      {
        nginxConfigPath: "configs/nginx/generated.conf",
        manifestPath: "./output/dash/live.mpd",
      },
      startupPlan,
    );

    expect(summary).toContain(
      "Generated NGINX config: configs/nginx/generated.conf",
    );
    expect(summary).toContain("FFmpeg manifest target: ./output/dash/live.mpd");
    expect(summary).toContain("Player URL: http://127.0.0.1:8080");
    expect(summary).toContain(
      "Manifest URL: http://127.0.0.1:8080/dash/live.mpd",
    );
  });

  it("includes executable startup commands for nginx and ffmpeg", () => {
    const summary = formatStartupSummary(
      {
        nginxConfigPath: "configs/nginx/generated.conf",
        manifestPath: "./output/dash/live.mpd",
      },
      startupPlan,
    );

    expect(summary).toContain(
      "NGINX command: nginx -c /workspace/project/configs/nginx/generated.conf",
    );
    expect(summary).toContain("FFmpeg command: ffmpeg -hide_banner -y");
  });

  it("states when audio mode is enabled", () => {
    const summary = formatStartupSummary(
      {
        nginxConfigPath: "configs/nginx/generated.conf",
        manifestPath: "./output/dash/live-audio.mpd",
      },
      {
        ...startupPlan,
        manifestUrl: "http://127.0.0.1:8080/dash/live-audio.mpd",
        ffmpeg: {
          ...startupPlan.ffmpeg,
          manifestPath: "./output/dash/live-audio.mpd",
        },
        audioEnabled: true,
      },
    );

    expect(summary).toContain("Audio mode: enabled");
    expect(summary).toContain(
      "Manifest URL: http://127.0.0.1:8080/dash/live-audio.mpd",
    );
  });
});
