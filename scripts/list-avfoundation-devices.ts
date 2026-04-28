import { listAvfoundationDevices } from "../src/server/ffmpeg/listAvfoundationDevices";

async function main(): Promise<void> {
  const devices = await listAvfoundationDevices();

  console.log("Video devices:");
  for (const device of devices.video) {
    console.log(`  [${device.id}] ${device.name}`);
  }

  console.log("Audio devices:");
  for (const device of devices.audio) {
    console.log(`  [${device.id}] ${device.name}`);
  }
}

void main();
