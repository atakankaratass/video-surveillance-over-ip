export interface DevOptions {
  configPath: string;
  startNginx: boolean;
  startFfmpeg: boolean;
  listDevices: boolean;
  audio: boolean;
  abr: boolean;
}

export function parseDevOptions(args: string[]): DevOptions {
  let configPath = "configs/app.example.json";
  let configProvided = false;
  let startNginx = false;
  let startFfmpeg = false;
  let listDevices = false;
  let audio = false;
  let abr = false;

  for (const arg of args) {
    if (arg === "--start-nginx") {
      startNginx = true;
      continue;
    }

    if (arg === "--start-ffmpeg") {
      startFfmpeg = true;
      continue;
    }

    if (arg === "--start-all") {
      startNginx = true;
      startFfmpeg = true;
      continue;
    }

    if (arg === "--list-devices") {
      listDevices = true;
      continue;
    }

    if (arg === "--audio") {
      audio = true;
      continue;
    }

    if (arg === "--abr") {
      abr = true;
      continue;
    }

    if (arg.startsWith("--")) {
      throw new Error(`Unknown argument: ${arg}`);
    }

    if (configProvided) {
      throw new Error("Only one config path may be provided.");
    }

    configPath = arg;
    configProvided = true;
  }

  return {
    configPath,
    startNginx,
    startFfmpeg,
    listDevices,
    audio,
    abr,
  };
}
