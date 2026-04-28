import { describe, expect, it } from "vitest";

import { parseAvfoundationDevices } from "../../src/server/ffmpeg/parseAvfoundationDevices";

describe("parseAvfoundationDevices", () => {
  it("extracts video and audio devices from ffmpeg avfoundation output", () => {
    const stderr = `[AVFoundation indev @ 0x123] AVFoundation video devices:
[AVFoundation indev @ 0x123] [0] FaceTime HD Camera
[AVFoundation indev @ 0x123] [1] OBS Virtual Camera
[AVFoundation indev @ 0x123] AVFoundation audio devices:
[AVFoundation indev @ 0x123] [0] MacBook Pro Microphone
[AVFoundation indev @ 0x123] [1] BlackHole 2ch`;

    expect(parseAvfoundationDevices(stderr)).toEqual({
      video: [
        { id: "0", name: "FaceTime HD Camera" },
        { id: "1", name: "OBS Virtual Camera" },
      ],
      audio: [
        { id: "0", name: "MacBook Pro Microphone" },
        { id: "1", name: "BlackHole 2ch" },
      ],
    });
  });

  it("returns empty arrays when no device lines are found", () => {
    expect(parseAvfoundationDevices("no devices here")).toEqual({
      video: [],
      audio: [],
    });
  });
});
