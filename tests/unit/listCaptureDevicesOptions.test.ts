import { describe, expect, it } from "vitest";

import { parseDevOptions } from "../../src/server/devOptions";

describe("dev device listing options", () => {
  it("supports the list devices flag", () => {
    expect(parseDevOptions(["--list-devices"])).toEqual({
      configPath: "configs/app.example.json",
      startNginx: false,
      startFfmpeg: false,
      listDevices: true,
      audio: false,
      abr: false,
    });
  });
});
