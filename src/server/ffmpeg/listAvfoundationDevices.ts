import { execFile } from "node:child_process";
import { promisify } from "node:util";

import {
  parseAvfoundationDevices,
  type AvfoundationDevices,
} from "./parseAvfoundationDevices";

const execFileAsync = promisify(execFile);

export async function listAvfoundationDevices(): Promise<AvfoundationDevices> {
  try {
    await execFileAsync("ffmpeg", [
      "-f",
      "avfoundation",
      "-list_devices",
      "true",
      "-i",
      "",
    ]);

    return {
      video: [],
      audio: [],
    };
  } catch (error) {
    const stderr =
      error instanceof Error && "stderr" in error ? String(error.stderr) : "";
    return parseAvfoundationDevices(stderr);
  }
}
