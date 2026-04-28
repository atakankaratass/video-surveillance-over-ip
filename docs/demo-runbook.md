# Demo Runbook

## Demo Goals

- Show live webcam capture
- Show browser playback
- Show time-shift controls
- Show screenshot capture
- Show latency results for 2, 4, and 6 second segments

## Notes

- iPhone and iOS DASH limitations will be documented explicitly.
- Desktop browsers and Android will be the preferred demo targets.
- Online demo and screen-share fallback steps will be documented before final submission.

## Current Local Demo Preparation Commands

- `make validate-env`
- `make list-devices`
- `make demo-check`
- `tsx scripts/dev.ts --start-nginx`
- `tsx scripts/dev.ts --start-ffmpeg`
- `tsx scripts/dev.ts --start-all`

## Current Demo Preparation Sequence

1. Run `make validate-env`.
2. Run `make list-devices` and confirm the correct camera and microphone IDs.
3. Update the local config if needed.
4. Run `make demo-check` to see whether the machine is close to demo-ready.
5. Generate startup artifacts with `tsx scripts/dev.ts`.
6. Start NGINX and FFmpeg when the local environment is ready.

## Not Yet Complete

- Real live DASH playback validation
- Real camera-backed screenshot verification
- Real time-shift verification against live output
