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
- `make validate-pr`

`make validate-env` currently checks:

- FFmpeg availability on PATH
- NGINX availability on PATH
- configured output path writability assumptions

Expected areas to document:

- local dependency installation
- FFmpeg verification
- NGINX verification
- webcam device selection
- local config creation from example config
