# Latency Methodology

This document records how end-to-end latency is currently measured for `2`, `4`, and `6` second segment durations.

## Timestamp Sources

- **Capture timestamp:** wall-clock time immediately before the local live stack is started for a given segment-duration run
- **Playback timestamp:** wall-clock time when a real browser session first observes the player video element with `currentTime > 0`

## Current Measurement Procedure

1. Generate an isolated temporary config for one segment duration.
2. Start the local stack for that config on a dedicated local port.
3. Wait until the browser player page is reachable.
4. Open the player in a headless browser.
5. Wait until the player video has started progressing (`currentTime > 0`).
6. Record the elapsed wall-clock difference between stack start and first observed playback progress.
7. Repeat for `2`, `4`, and `6` second segment durations.

## Current Tooling

- Run the latency matrix with `npm run latency:run`
- Equivalent Make target: `make latency-run`
- Current output file: `docs/latency-results.md`

## Current Tooling

- Generate a report scaffold with `npm run latency:run`
- Equivalent Make target: `make latency-run`

The current implementation includes:

- latency measurement records
- aggregation by segment duration
- markdown table formatting for report inclusion
- isolated per-duration local runs

## Current Real Results

See `docs/latency-results.md`.

At the moment, the recorded single-sample results are:

- `2s` segments: `1946 ms`
- `4s` segments: `2236 ms`
- `6s` segments: `1714 ms`

## Known Limitations

- The current run uses a single sample per segment duration.
- The timing includes local stack startup effects, not just steady-state playback delay.
- Browser scheduling and local machine load can affect the observed playback timestamp.
- This is already useful for the assignment, but we should ideally repeat runs and average multiple samples before final report freeze.
