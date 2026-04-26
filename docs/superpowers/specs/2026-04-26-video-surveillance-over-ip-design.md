# Video Surveillance over IP Design

## Goal

Build an individual CS 418 project that captures live webcam video on the server, encodes and stores it with FFmpeg, delivers it over HTTP in DASH live profile format, and provides a custom HTML5 MSE player with time-shifting, pause, go-live, and screenshot support. The implementation must remain within the professor's rules and include the optional extra-credit features.

## Hard Constraints

- Individual project
- No copied code
- FFmpeg required for capture/encoding
- HTTP delivery in DASH live profile
- HTML5 page with MSE and JavaScript only
- No plug-ins
- Required controls: seek, pause, go-live, screenshot
- H.264/AVC required
- AAC required if audio is included
- Segment durations: 2, 4, 6 seconds
- Latency must be measured for each segment duration
- No hardcoded system-specific paths
- Prefer own basic player logic over a full third-party player UI

## Optional Features To Implement

- Audio capture and playback
- Adaptive DASH with multiple representations
- Motion detection with viewer notifications
- Thumbnail-assisted seeking UI

## Recommended Architecture

- FFmpeg pipeline for capture, encode, package
- NGINX for HTTP delivery of DASH assets
- TypeScript/Node orchestration for config, process control, metrics, and optional services
- Custom HTML5 player using dash.js only as the MSE/DASH engine

## Major Components

### Capture and Packaging

- Webcam input
- Optional microphone input
- Baseline H.264 live DASH output
- Optional AAC audio
- Optional ABR ladder
- Rolling DVR window for time-shift

### Delivery

- NGINX serves `.mpd`, segments, and frontend assets
- Config-driven paths and ports

### Player

- HTML5 `<video>`
- dash.js playback engine
- Custom controls
- Screenshot export
- Live edge management
- Thumbnail preview
- Motion notifications UI

### Validation

- Unit tests for config, command generation, and helpers
- Integration tests for orchestration and generated assets
- Playwright tests for player behavior
- Real-system local smoke validation with actual webcam

## Risks and Handling

- iOS DASH limitation: document clearly, recommend desktop or Android for demo
- Webcam device paths differ by machine: config plus environment validation
- CI cannot fully emulate a real webcam pipeline: use fixture-based browser testing plus local real-system smoke validation
- Optional features must not destabilize baseline: baseline first, extras after

## Report Strategy

- Final report will be written last
- Short 1-2 pages
- Include screenshots, key code excerpts, run instructions, results, and SDK/open-source usage disclosure
