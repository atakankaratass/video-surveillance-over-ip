# Demo Runbook

## Demo Goals

- Show live webcam capture
- Show browser playback
- Show time-shift controls
- Show screenshot capture
- Show latency results for 2, 4, and 6 second segments

## Notes

- iOS Safari does not support the DASH playback path used in this assignment.
- Desktop browsers and Android are the recommended demo targets.
- Audio mode is optional extra credit and should only be shown if `capture.audioDevice` is configured and the audio path has been verified locally.

## Canonical Demo Commands

- `make validate-env`
- `make list-devices`
- `make demo-check`
- `make startup-all`
- `make startup-audio`
- `make startup-stop`

Lower-level `tsx scripts/dev.ts ...` commands are still available for debugging, but the canonical demo path should use the `make` surface above.

## Exact Demo Preparation Sequence

1. Run `make validate-env`.
2. Run `make list-devices` and confirm the correct camera and microphone IDs.
3. Update the local config if the selected camera or microphone differs from the intended demo device.
4. Run `make demo-check` as a preflight readiness check.
5. Run `make startup-all` for the baseline demo path, or `make startup-audio` only if you plan to show the audio extra-credit flow.
6. Open the printed player URL in the browser.
7. Confirm that playback starts before the live demonstration begins.

## Manual Verification Steps

During the demo preparation run, confirm all of the following:

- the browser requests `/dash/live.mpd` for the baseline flow or `/dash/live-audio.mpd` for the audio flow
- new DASH segment files continue to appear under `output/dash/`
- the Pause button freezes playback
- the seek controls rewind to an older point in the live window
- the Go Live button returns playback to the live edge
- the Screenshot button creates an image file on disk

## Demo Script

Use this order during the live demo:

1. Show that the player URL opens.
2. Show the live video playback.
3. Demonstrate Pause.
4. Demonstrate seeking backward in the live window.
5. Demonstrate Go Live.
6. Demonstrate Screenshot and show the saved output image.
7. Summarize the 2/4/6 second segment latency results.

## Fallback Plan

- If the remote browser cannot connect to the hosted URL, fall back to screen sharing the local browser session.
- If the live pipeline behaves unexpectedly during the demo, keep the latest verified screenshots, latency results, and saved screenshot output ready as supporting evidence while restarting the stack.

## Platform Recommendation

- Prefer desktop browsers for the main demo.
- Android is an acceptable secondary option.
- Do not rely on iPhone or iOS Safari for DASH playback in this assignment.
