# Architecture

## Planned System

- FFmpeg captures webcam input and generates live DASH output.
- NGINX serves the DASH manifest, segments, and player assets.
- A TypeScript/Node orchestration layer manages config, FFmpeg process lifecycle, generated configs, latency logging, and optional services.
- A custom HTML5 player uses dash.js only as the playback engine and implements its own UI controls.

## Major Subsystems

- Capture and packaging
- HTTP delivery
- Browser player
- Metrics and latency measurement
- Optional audio, motion, and thumbnail services
