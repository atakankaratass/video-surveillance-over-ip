# Video Surveillance over IP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CS 418-compliant live video surveillance system over IP with FFmpeg, DASH, a custom HTML5 player, strict quality gates, and all optional extra-credit features.

**Architecture:** FFmpeg captures and packages live DASH output. NGINX serves the manifest and segments. A TypeScript/Node orchestration layer manages config, processes, latency measurement, motion and thumbnail services. The browser uses a custom HTML5 player with dash.js only as the playback engine.

**Tech Stack:** Node.js 20, TypeScript, FFmpeg, NGINX, dash.js, ESLint, Husky, lint-staged, Vitest, Playwright, GitHub Actions.

---

## File Structure

- `AGENTS.md`
- `CONTRIBUTING.md`
- `README.md`
- `Makefile`
- `.nvmrc`
- `package.json`
- `tsconfig.json`
- `eslint.config.mjs`
- `playwright.config.ts`
- `vitest.config.ts`
- `.husky/pre-commit`
- `.husky/pre-push`
- `.github/workflows/ci.yml`
- `.github/workflows/e2e.yml`
- `.github/workflows/security.yml`
- `configs/app.example.json`
- `configs/ffmpeg/baseline.json`
- `configs/ffmpeg/audio.json`
- `configs/ffmpeg/abr.json`
- `configs/nginx/nginx.template.conf`
- `docs/assignment-compliance.md`
- `docs/architecture.md`
- `docs/setup.md`
- `docs/demo-runbook.md`
- `docs/latency-methodology.md`
- `docs/optional-features.md`
- `docs/report-outline.md`
- `src/server/**`
- `src/player/**`
- `src/shared/**`
- `tests/unit/**`
- `tests/integration/**`
- `tests/e2e/**`
- `tests/fixtures/**`
- `report/assets/**`

## Task 1: Bootstrap and Quality Gates

**Files:**

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.nvmrc`
- Create: `.gitignore`
- Create: `.husky/pre-commit`
- Create: `.husky/pre-push`
- Create: `Makefile`

- [ ] Initialize Node/TypeScript project
- [ ] Add `lint`, `typecheck`, `test`, `build`, `e2e`, `validate:push`
- [ ] Configure Husky and lint-staged
- [ ] Make pre-commit fast and staged-file-only
- [ ] Make pre-push run full local validation
- [ ] Add `make validate-pr`
- [ ] Enforce zero-warning lint and no bypass rules

## Task 2: Repo Rules and Docs Skeleton

**Files:**

- Create: `AGENTS.md`
- Create: `CONTRIBUTING.md`
- Create: `README.md`
- Create: `docs/assignment-compliance.md`
- Create: `docs/architecture.md`
- Create: `docs/setup.md`
- Create: `docs/demo-runbook.md`
- Create: `docs/latency-methodology.md`
- Create: `docs/optional-features.md`
- Create: `docs/report-outline.md`

- [ ] Write agent rules
- [ ] Write contributor rules
- [ ] Map every professor requirement to implementation
- [ ] Document setup and demo steps
- [ ] Reserve final report structure

## Task 3: Config and Environment Validation

**Files:**

- Create: `configs/app.example.json`
- Create: `src/server/config.ts`
- Create: `scripts/validate-environment.ts`
- Test: `tests/unit/config.test.ts`
- Test: `tests/unit/validate-environment.test.ts`

- [ ] Write failing tests first
- [ ] Implement config parsing and validation
- [ ] Validate FFmpeg, NGINX, output dirs, and device config
- [ ] Keep all paths configurable

## Task 4: Baseline FFmpeg Live DASH Pipeline

**Files:**

- Create: `src/server/ffmpeg/buildBaselineCommand.ts`
- Create: `configs/ffmpeg/baseline.json`
- Test: `tests/unit/buildBaselineCommand.test.ts`

- [ ] Write failing tests
- [ ] Build H.264 live DASH command
- [ ] Support segment durations 2, 4, 6
- [ ] Support rolling DVR window
- [ ] Keep commands config-driven

## Task 5: NGINX Config Generation

**Files:**

- Create: `configs/nginx/nginx.template.conf`
- Create: `src/server/nginx/generateConfig.ts`
- Create: `scripts/generate-nginx-config.ts`
- Test: `tests/unit/generate-nginx-config.test.ts`

- [ ] Write failing tests
- [ ] Generate HTTP config for manifest, segments, and frontend
- [ ] Keep ports and roots configurable

## Task 6: Orchestration Layer

**Files:**

- Create: `src/server/ffmpeg/processManager.ts`
- Create: `src/server/server.ts`
- Create: `scripts/dev.ts`
- Test: `tests/unit/processManager.test.ts`
- Test: `tests/integration/server-bootstrap.test.ts`

- [ ] Write failing tests
- [ ] Implement start/stop/restart control
- [ ] Implement error handling and startup checks

## Task 7: Custom Player Shell

**Files:**

- Create: `src/player/index.html`
- Create: `src/player/main.ts`
- Create: `src/player/controls.ts`
- Create: `src/player/live-edge.ts`
- Test: `tests/unit/live-edge.test.ts`
- Test: `tests/e2e/player-shell.spec.ts`

- [ ] Write failing tests
- [ ] Integrate dash.js as playback engine only
- [ ] Build custom player UI
- [ ] Show connection and live state

## Task 8: Required Controls

**Files:**

- Create: `src/player/timeline.ts`
- Modify: `src/player/controls.ts`
- Test: `tests/unit/controls.test.ts`
- Test: `tests/e2e/required-controls.spec.ts`

- [ ] Write failing tests
- [ ] Implement pause
- [ ] Implement seek to specific time
- [ ] Implement go-live
- [ ] Handle DVR window correctly

## Task 9: Screenshot Feature

**Files:**

- Create: `src/player/screenshot.ts`
- Test: `tests/unit/screenshot.test.ts`
- Test: `tests/e2e/screenshot.spec.ts`

- [ ] Write failing tests
- [ ] Draw current frame to canvas
- [ ] Export PNG or JPEG
- [ ] Verify browser download behavior

## Task 10: Latency Measurement

**Files:**

- Create: `src/server/latency/measure.ts`
- Create: `src/server/latency/report.ts`
- Create: `scripts/run-latency-matrix.ts`
- Test: `tests/unit/latency-measure.test.ts`

- [ ] Write failing tests
- [ ] Measure latency for 2, 4, 6 second segments
- [ ] Produce machine-readable output
- [ ] Document methodology and limitations

## Task 11: Audio Extra Credit

**Files:**

- Create: `src/server/ffmpeg/buildAudioCommand.ts`
- Create: `configs/ffmpeg/audio.json`
- Test: `tests/unit/buildAudioCommand.test.ts`
- Test: `tests/integration/audio-pipeline.test.ts`

- [ ] Write failing tests
- [ ] Add microphone capture
- [ ] Encode with AAC
- [ ] Keep feature optional and config-driven

## Task 12: Adaptive DASH Extra Credit

**Files:**

- Create: `src/server/ffmpeg/buildAbrCommand.ts`
- Create: `configs/ffmpeg/abr.json`
- Test: `tests/unit/buildAbrCommand.test.ts`
- Test: `tests/integration/abr-manifest.test.ts`

- [ ] Write failing tests
- [ ] Add low, medium, high representations
- [ ] Generate multi-representation MPD
- [ ] Verify dash.js adaptation behavior

## Task 13: Motion Detection Extra Credit

**Files:**

- Create: `src/server/motion/detectMotion.ts`
- Create: `src/server/motion/service.ts`
- Create: `src/server/notifications/events.ts`
- Test: `tests/unit/detectMotion.test.ts`
- Test: `tests/integration/motion-service.test.ts`

- [ ] Write failing tests
- [ ] Implement simple frame-difference motion detection
- [ ] Emit viewer notification events
- [ ] Keep thresholds configurable

## Task 14: Motion Notification UI

**Files:**

- Create: `src/player/notifications.ts`
- Test: `tests/e2e/motion-notification.spec.ts`

- [ ] Write failing tests
- [ ] Render motion alerts in player UI
- [ ] Keep implementation simple and non-disruptive

## Task 15: Thumbnail Seek UI Extra Credit

**Files:**

- Create: `src/server/thumbnails/generateThumbnails.ts`
- Create: `src/server/thumbnails/metadata.ts`
- Create: `src/player/thumbnails.ts`
- Test: `tests/unit/thumbnail-metadata.test.ts`
- Test: `tests/e2e/thumbnail-preview.spec.ts`

- [ ] Write failing tests
- [ ] Generate thumbnails periodically
- [ ] Expose metadata to player
- [ ] Show hover previews on timeline

## Task 16: Real-System Demo Flow

**Files:**

- Modify: `README.md`
- Modify: `docs/demo-runbook.md`
- Create: `scripts/demo-check.ts`
- Test: `tests/integration/demo-check.test.ts`

- [ ] Add real demo checklist
- [ ] Verify webcam detection
- [ ] Verify DASH playback
- [ ] Verify required controls
- [ ] Verify screenshot
- [ ] Verify latency results
- [ ] Document iOS limitation and Android or desktop recommendation

## Task 17: GitHub Actions

**Files:**

- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/e2e.yml`
- Create: `.github/workflows/security.yml`

- [ ] Add CI for lint, typecheck, tests, and build
- [ ] Add separate E2E workflow
- [ ] Add dependency and security checks
- [ ] Mirror local validation, not replace it

## Task 18: Final Report

**Files:**

- Create later: `report/project-report.md` or source format
- Create later: `report/assets/*`
- Modify later: `docs/report-outline.md`

- [ ] Write report last
- [ ] Keep it 1-2 pages
- [ ] Include intro
- [ ] Include architecture summary
- [ ] Include important code snippets
- [ ] Include how to run
- [ ] Include results and latency summary
- [ ] Include optional features summary
- [ ] Include conclusion
- [ ] Include SDK/open-source usage list
- [ ] Include screenshots of player UI, live playback, screenshot output, thumbnail preview, motion alert, and latency table or chart

## Master Checklists

### Assignment Compliance

- [ ] Webcam capture exists
- [ ] Real-time encode exists
- [ ] Server-side storage exists
- [ ] HTTP delivery exists
- [ ] DASH live profile exists
- [ ] HTML5 MSE and JavaScript only
- [ ] No plugin usage
- [ ] Seek implemented
- [ ] Pause implemented
- [ ] Go-live implemented
- [ ] Screenshot implemented
- [ ] H.264 used
- [ ] AAC used if audio enabled
- [ ] 2, 4, 6 second segment testing done
- [ ] Latency measured
- [ ] No hardcoded system paths
- [ ] SDK and open-source disclosure prepared

### Quality Gates

- [ ] Husky pre-commit
- [ ] Husky pre-push
- [ ] ESLint zero-warning
- [ ] Strict typecheck
- [ ] Unit tests
- [ ] Integration tests
- [ ] Playwright tests
- [ ] Build verification
- [ ] GitHub Actions CI
- [ ] Security workflow
- [ ] AGENTS.md
- [ ] CONTRIBUTING.md
- [ ] Updated docs

### Extra Credit

- [ ] Audio
- [ ] Adaptive DASH
- [ ] Motion detection
- [ ] Thumbnails

### Demo Readiness

- [ ] Real webcam pipeline works locally
- [ ] Browser playback works
- [ ] Required controls work
- [ ] Screenshot works
- [ ] Latency results collected
- [ ] iOS limitation documented
- [ ] Online demo fallback documented

### Submission Readiness

- [ ] Code complete
- [ ] Results included
- [ ] Final report included
- [ ] Screenshots included
- [ ] Run instructions included
- [ ] Zip packaging checklist complete
