import { describe, expect, it } from "vitest";

import { parseDevOptions } from "../../src/server/devOptions";

describe("parseDevOptions", () => {
  it("uses the example config by default", () => {
    expect(parseDevOptions([])).toEqual({
      configPath: "configs/app.example.json",
      startNginx: false,
      startFfmpeg: false,
      listDevices: false,
    });
  });

  it("reads an explicit config path and start flags", () => {
    expect(
      parseDevOptions([
        "configs/local.json",
        "--start-nginx",
        "--start-ffmpeg",
      ]),
    ).toEqual({
      configPath: "configs/local.json",
      startNginx: true,
      startFfmpeg: true,
      listDevices: false,
    });
  });

  it("supports a single flag to start both nginx and ffmpeg", () => {
    expect(parseDevOptions(["--start-all"])).toEqual({
      configPath: "configs/app.example.json",
      startNginx: true,
      startFfmpeg: true,
      listDevices: false,
    });
  });

  it("rejects unknown flags", () => {
    expect(() => parseDevOptions(["--bad-flag"])).toThrowError(
      "Unknown argument: --bad-flag",
    );
  });

  it("rejects multiple config paths", () => {
    expect(() => parseDevOptions(["a.json", "b.json"])).toThrowError(
      "Only one config path may be provided.",
    );
  });
});
