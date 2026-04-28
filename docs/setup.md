# Setup

## Planned Prerequisites

- Node.js 20
- FFmpeg available on PATH
- NGINX available on PATH
- A webcam connected to the host machine

## Planned Setup Flow

Current bootstrap commands:

- `make install`
- `make validate-env`
- `make list-devices`
- `make startup-prepare`
- `make startup-nginx`
- `make startup-ffmpeg`
- `make startup-all`
- `make validate-pr`

`make validate-env` currently checks:

- FFmpeg availability on PATH
- NGINX availability on PATH
- configured output path writability assumptions

`make list-devices` currently helps with:

- discovering local FFmpeg `avfoundation` video device IDs
- discovering local FFmpeg `avfoundation` audio device IDs
- preparing a real `capture.inputSource` value for live capture testing

`make startup-prepare` currently helps with:

- creating required runtime directories
- generating the local NGINX config file
- printing the player URL, manifest URL, and launch commands

Expected areas to document:

- local dependency installation
- FFmpeg verification
- NGINX verification
- webcam device selection
- local config creation from example config
