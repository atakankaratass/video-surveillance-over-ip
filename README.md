# CS 418 Project 2: Video Surveillance over IP

This repository contains a CS 418 individual project that captures live webcam video, encodes it with FFmpeg, delivers it over HTTP in DASH live profile format, and plays it in a custom HTML5 MSE-based browser player.

## Required Reading Order

- Human contributors: read `README.md`, then `CONTRIBUTING.md`.
- AI agents: read `AGENTS.md` first, then `CONTRIBUTING.md`, then return to `README.md` before doing any work.
- AI tools must treat `AGENTS.md` and `CONTRIBUTING.md` as binding repository policy.

## Status

The repository is being built incrementally with strict checkpoints. Baseline documentation and execution plans are in place first; tooling and implementation follow step by step.

## Core Requirements

- Live webcam capture on the server
- Real-time encoding and storage with FFmpeg
- HTTP delivery in DASH live profile
- HTML5 player with MSE and JavaScript only
- Required controls: seek, pause, go-live, screenshot
- Segment duration experiments: 2, 4, 6 seconds with latency notes

## Extra Goals

- Audio capture and playback
- Adaptive DASH
- Motion detection and viewer notifications
- Thumbnail-assisted seek UI

## Project Docs

- `docs/assignment-compliance.md`
- `docs/architecture.md`
- `docs/setup.md`
- `docs/demo-runbook.md`
- `docs/latency-methodology.md`
- `docs/optional-features.md`
- `docs/project-checklist.md`
- `docs/report-outline.md`
- `docs/superpowers/specs/2026-04-26-video-surveillance-over-ip-design.md`
- `docs/superpowers/plans/2026-04-26-video-surveillance-over-ip.md`

## Current Phase

Phase 2: tooling bootstrap plus config and environment validation.

## Available Commands

- `make install`
- `make lint`
- `make typecheck`
- `make test`
- `make build`
- `make e2e`
- `make validate-env`
- `make list-devices`
- `make demo-check`
- `make startup-prepare`
- `make startup-nginx`
- `make startup-ffmpeg`
- `make startup-all`
- `make validate-pr`

## GitHub Actions

- `CI`: mirrors local lint, typecheck, test, and build checks
- `E2E`: runs the Playwright browser suite
- `Security`: runs dependency audit checks

GitHub Actions is a backup safety net. Local validation is still required before commits are pushed.

## Local Browser Testing

- Headless browser tests: `npm run e2e`
- Visible local browser run: `npm run e2e:headed`

The project will be announced as manual-demo-ready once the real player flow and baseline streaming pipeline are in place.

## Capture Device Discovery

- List local camera and microphone devices: `npm run list:devices`
- Equivalent Make target: `make list-devices`

On macOS, this uses FFmpeg's `avfoundation` device listing path because the current implementation targets the assignment's FFmpeg-based local capture workflow.

## Demo Readiness

- Run a local readiness check: `npm run demo:check`
- Equivalent Make target: `make demo-check`

This command is intended to tell us whether the local machine is close to a real assignment demo state, based on environment validation, generated config presence, device discovery, and DASH artifact presence.

## Startup Helpers

- Generate startup artifacts and summary: `npm run startup:prepare`
- Generate artifacts and start NGINX: `npm run startup:nginx`
- Generate artifacts and start FFmpeg: `npm run startup:ffmpeg`
- Generate artifacts and start both: `npm run startup:all`

Equivalent Make targets:

- `make startup-prepare`
- `make startup-nginx`
- `make startup-ffmpeg`
- `make startup-all`
