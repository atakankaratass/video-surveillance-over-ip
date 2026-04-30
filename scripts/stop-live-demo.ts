import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function tryRun(command: string, args: string[]): Promise<void> {
  try {
    await execFileAsync(command, args);
  } catch {
    // Best-effort cleanup only.
  }
}

async function main(): Promise<void> {
  await tryRun("pkill", [
    "-f",
    "ffmpeg -hide_banner -y -framerate 30 -use_wallclock_as_timestamps 1 -f avfoundation",
  ]);
  await tryRun("nginx", [
    "-c",
    "/Users/atakankaratas/Development/CS 418 Project 2/configs/nginx/generated.conf",
    "-p",
    "/Users/atakankaratas/Development/CS 418 Project 2",
    "-s",
    "stop",
  ]);
  await tryRun("pkill", [
    "-f",
    "nginx: master process nginx -c /Users/atakankaratas/Development/CS 418 Project 2/configs/nginx/generated.conf",
  ]);

  console.log("Live demo processes stop command completed.");
}

void main();
