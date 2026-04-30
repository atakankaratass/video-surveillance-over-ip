# Latency Methodology

This document will record how end-to-end latency is measured for 2, 4, and 6 second segment durations.

Planned contents:

- timestamp sources
- measurement assumptions
- repeated run procedure
- result format
- known limitations

## Current Tooling

- Generate a report scaffold with `npm run latency:run`
- Equivalent Make target: `make latency-run`

The current implementation includes:

- latency measurement records
- aggregation by segment duration
- markdown table formatting for report inclusion

The real assignment result set is still pending. The current command is a report-generation scaffold until we collect actual 2/4/6 second live measurements.
