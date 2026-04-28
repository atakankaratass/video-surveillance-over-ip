export interface CaptureDevice {
  id: string;
  name: string;
}

export interface AvfoundationDevices {
  video: CaptureDevice[];
  audio: CaptureDevice[];
}

const DEVICE_LINE_REGEX = /^.*\[(\d+)\]\s+(.+)$/;

export function parseAvfoundationDevices(stderr: string): AvfoundationDevices {
  const result: AvfoundationDevices = {
    video: [],
    audio: [],
  };

  let currentSection: "video" | "audio" | null = null;

  for (const line of stderr.split(/\r?\n/)) {
    if (line.includes("AVFoundation video devices:")) {
      currentSection = "video";
      continue;
    }

    if (line.includes("AVFoundation audio devices:")) {
      currentSection = "audio";
      continue;
    }

    if (!currentSection) {
      continue;
    }

    const match = line.match(DEVICE_LINE_REGEX);

    if (!match) {
      continue;
    }

    const [, id, name] = match;

    result[currentSection].push({
      id,
      name,
    });
  }

  return result;
}
