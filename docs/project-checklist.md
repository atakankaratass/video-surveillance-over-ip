# Project Checklist

This file is the living implementation checklist for the CS 418 `Video Surveillance over IP` project.

It is intentionally more practical than the original design and plan documents:

- it records what has already been completed
- it records what is still pending
- it is updated during implementation as milestones move forward

Reference documents:

- `Video Surveillance over IP.pdf`
- `docs/superpowers/specs/2026-04-26-video-surveillance-over-ip-design.md`
- `docs/superpowers/plans/2026-04-26-video-surveillance-over-ip.md`

## Ground Rules Audit

- [x] Project remains aligned with the assignment PDF
- [x] Work remains aligned with the approved design and implementation plan
- [x] FFmpeg is still the required capture/encoding path
- [x] DASH live profile over HTTP is still the target delivery model
- [x] HTML5 + MSE + JavaScript only is still the browser target
- [x] No plugin-based player has been introduced
- [x] Custom player UI remains the chosen approach
- [x] Hardcoded system-specific paths are still avoided in config design
- [x] Local-first validation remains mandatory before completion claims

## Repository Governance And Quality Gates

- [x] Initialize local git repository
- [x] Create public GitHub repository
- [x] Add strict `AGENTS.md`
- [x] Add strict `CONTRIBUTING.md`
- [x] Add bootstrap `README.md`
- [x] Add implementation design document
- [x] Add implementation plan document
- [x] Add assignment compliance doc
- [x] Add setup doc
- [x] Add architecture doc
- [x] Add demo runbook doc
- [x] Add optional features doc
- [x] Add report outline doc
- [x] Add `.nvmrc`
- [x] Add `.gitignore`
- [x] Ignore unrelated reference report file
- [x] Add `package.json`
- [x] Add `tsconfig.json`
- [x] Add `eslint.config.mjs`
- [x] Add `vitest.config.ts`
- [x] Add `vite.config.ts`
- [x] Add `playwright.config.ts`
- [x] Add `Makefile`
- [x] Add Husky pre-commit hook
- [x] Add Husky pre-push hook
- [x] Add `lint-staged`
- [x] Enforce zero-warning lint locally
- [x] Enforce typecheck locally
- [x] Enforce build locally
- [x] Enforce Playwright locally
- [x] Verify `validate:push` passes locally

## Current GitHub Actions Status

- [ ] Commit and push GitHub Actions workflows
- [ ] Verify `CI` workflow on GitHub
- [ ] Verify `E2E` workflow on GitHub
- [ ] Verify `Security` workflow on GitHub

Current local state:

- GitHub Actions workflow files have been created locally but are not yet committed in the current branch state.

## Config And Environment Validation

- [x] Add app config example file
- [x] Add typed config parser
- [x] Support validated segment durations: `2`, `4`, `6`
- [x] Reject absolute output paths in config
- [x] Add environment validation script
- [x] Validate FFmpeg availability on PATH
- [x] Validate NGINX availability on PATH
- [x] Validate output path writability assumptions
- [x] Add unit tests for config parsing
- [x] Add unit tests for environment validation
- [x] Add `make validate-env`

## Capture Configuration Evolution

- [x] Replace placeholder capture device model with structured capture config
- [x] Add `capture.inputFormat`
- [x] Add `capture.inputSource`
- [x] Add `capture.frameRate`
- [x] Update FFmpeg command generation tests to use real capture fields
- [x] Update bootstrap/test fixtures to use real capture fields

## FFmpeg And NGINX Baseline Generation

- [x] Add baseline FFmpeg command builder
- [x] Generate H.264 baseline command
- [x] Keep DASH manifest output path configurable
- [x] Derive DASH window size from DVR duration and segment size
- [x] Add baseline FFmpeg config file
- [x] Add NGINX config generator
- [x] Add NGINX template file
- [x] Add script for generated NGINX config output
- [x] Add unit tests for FFmpeg command generation
- [x] Add unit tests for NGINX config generation

## Runtime Bootstrap And Startup Planning

- [x] Add process manager for named child processes
- [x] Add bootstrap server integration helper
- [x] Add runtime path resolver helper
- [x] Ensure runtime directories are created before startup artifacts are written
- [x] Add startup plan builder
- [x] Add startup summary formatter
- [x] Add dev options parser
- [x] Support `--start-nginx`
- [x] Support `--start-ffmpeg`
- [x] Support `--start-all`
- [x] Support `--list-devices`
- [x] Support clean process shutdown on Ctrl+C
- [x] Add startup requirements evaluation for real machine readiness
- [x] Print player URL in dev startup summary
- [x] Print manifest URL in dev startup summary
- [x] Print explicit FFmpeg command in dev startup summary
- [x] Print explicit NGINX command in dev startup summary
- [x] Add avfoundation device parsing helper
- [x] Add avfoundation device listing script
- [x] Verify avfoundation device listing on the real local machine
- [x] Add unit tests for process manager
- [x] Add integration tests for bootstrap server
- [x] Add unit tests for runtime path helpers
- [x] Add unit tests for startup plan
- [x] Add unit tests for startup summary
- [x] Add unit tests for dev option parsing
- [x] Add unit tests for avfoundation device parsing

## Browser Player Shell

- [x] Replace plain bootstrap text page with player shell
- [x] Keep project heading visible
- [x] Add visible video element placeholder
- [x] Add visible player status label
- [x] Add visible Pause button
- [x] Add visible Go Live button
- [x] Add visible Screenshot button
- [x] Add `dash.js` playback adapter scaffold
- [x] Add unit tests for player shell rendering
- [x] Add Playwright smoke test for player shell rendering

## Player Controls And Screenshot Flow

- [x] Add controls helper module
- [x] Add pause/resume label logic
- [x] Add playback status toggle logic
- [x] Add live-edge helper logic
- [x] Wire Pause button to status changes
- [x] Wire Go Live button to status changes
- [x] Add screenshot helper module
- [x] Add screenshot filename generation
- [x] Add screenshot canvas capture flow
- [x] Surface screenshot success/failure status in UI
- [x] Add unit tests for controls helpers
- [x] Add unit tests for screenshot helpers
- [x] Add Playwright interaction coverage for pause/go-live flow

## Manual Testing Readiness

- [x] Local player shell can be opened in browser with `npm run dev`
- [x] Visible Playwright run is available with `npm run e2e:headed`
- [x] Player shell interaction can be manually tested without live stream
- [x] Startup prep command can generate runtime directories and NGINX config locally
- [x] Real local DASH stream playback is ready
- [x] Real local FFmpeg camera capture is ready
- [x] Real local NGINX delivery is ready
- [x] Real local screenshot from live video is ready

## GitHub Repository Progress

- [x] Initial governance/tooling milestone committed
- [x] Config/environment milestone committed
- [x] FFmpeg/NGINX generator milestone committed
- [x] Process orchestration milestone committed
- [x] Player shell milestone committed
- [x] Interactive controls and screenshot milestone committed
- [x] Capture config/runtime bootstrap milestone committed
- [ ] Current local startup/dev/CI workflow milestone committed

Current local startup/dev/CI milestone contents:

- GitHub Actions workflows added locally
- README updated with GitHub Actions notes
- startup plan module added locally
- startup summary module added locally
- dev options parser added locally
- avfoundation device discovery helpers added locally
- local avfoundation device discovery command verified on the real machine
- demo readiness check script added locally
- local demo readiness command verified on the real machine
- startup artifact generation command verified on the real machine
- startup helper command surface expanded and validated locally
- startup requirements reporting verified on the real machine

## Remaining Core Assignment Work

- [x] Start NGINX successfully using generated config
- [x] Start FFmpeg successfully with real local camera input
- [x] Produce `live.mpd` and DASH segments locally
- [x] Serve generated DASH assets from NGINX
- [x] Confirm browser player can request the manifest successfully
- [x] Confirm browser player can start live playback from real DASH output
- [x] Verify local avfoundation device discovery against the real machine
- [x] Implement real live-edge behavior using actual stream state
- [x] Implement real pause behavior against live playback state
- [x] Implement real time-shift / rewind behavior against seekable live window
- [x] Implement explicit seek-to-time behavior in the player UI
- [x] Verify screenshot against real video frames instead of placeholder state
- [x] Validate end-to-end local flow with real camera capture

## Latency Measurement Work

- [x] Add latency measurement module
- [x] Add latency report output module
- [x] Add latency run script
- [x] Record latency for `2` second segments
- [x] Record latency for `4` second segments
- [x] Record latency for `6` second segments
- [x] Add latency methodology scaffold and report generation notes
- [x] Document latency methodology and limitations with real results

## Extra Credit Features

### Audio

- [x] Add optional audio FFmpeg command builder
- [x] Add audio config file
- [x] Add audio pipeline tests
- [x] Capture microphone input
- [x] Encode audio as AAC
- [x] Verify browser playback with audio

### Adaptive DASH

- [x] Add ABR FFmpeg command builder
- [x] Add ABR config file
- [x] Add ABR manifest tests
- [x] Generate multi-representation DASH output
- [x] Verify dash.js adaptation behavior

### Motion Detection

- [ ] Add motion detection core
- [ ] Add motion service
- [ ] Add viewer notification event model
- [ ] Add motion detection tests
- [ ] Render motion notification UI

### Thumbnail Seek UI

- [x] Add thumbnail generation service
- [x] Add thumbnail metadata service
- [x] Add thumbnail player UI module
- [x] Add thumbnail metadata tests
- [x] Add thumbnail preview browser test

## Demo And Submission Preparation

- [x] Add real demo check script
- [x] Expand demo runbook with exact launch sequence
- [x] Verify webcam detection path for demo machine
- [x] Verify browser playback path for demo machine
- [x] Verify required controls in the real demo flow
- [x] Verify screenshot in the real demo flow
- [x] Document iOS limitation explicitly in final demo docs
- [x] Document Android/desktop recommendation explicitly
- [x] Prepare submission zip contents checklist
- [x] Prepare SDK/open-source usage disclosure list

## Final Report

- [ ] Create final report source file
- [ ] Keep final report to roughly 1-2 pages
- [ ] Add introduction section
- [ ] Add system architecture summary
- [ ] Add important code snippets
- [ ] Add how-to-run section
- [ ] Add latency/results summary
- [ ] Add optional features summary
- [ ] Add conclusion
- [ ] Add references / SDKs used
- [ ] Capture player UI screenshots
- [ ] Capture live playback screenshots
- [ ] Capture screenshot feature output image
- [ ] Capture thumbnail preview screenshots if implemented
- [ ] Capture motion notification screenshots if implemented

## Final Assignment Compliance Checklist

- [x] Webcam capture exists in the real pipeline
- [x] Real-time encoding exists in the real pipeline
- [x] Server-side storage exists in the real pipeline
- [x] HTTP delivery exists in the real pipeline
- [x] DASH live profile exists in the real pipeline
- [x] HTML5 MSE + JavaScript playback is working
- [x] No plugin-based player is used
- [x] H.264 baseline path is the encoding target
- [x] Required seek control is working against real live output
- [x] Required pause control is working against real live output
- [x] Required go-live control is working against real live output
- [x] Required screenshot control is working against real live output
- [x] Segment tests for 2/4/6 seconds are complete
- [x] Latency measurements for 2/4/6 seconds are complete
- [x] Optional features implemented for extra credit
- [ ] Final report completed
- [ ] Screenshots captured for report
- [ ] Submission bundle prepared

## Update Rule

Whenever a meaningful milestone is finished:

- convert relevant unchecked items to checked items in this file
- add any newly discovered project-level tasks here
- do not add trivial micro-steps unless they affect delivery, validation, or compliance
