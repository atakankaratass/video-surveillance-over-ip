# Audio Extra Credit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optional audio mode ile mikrofon girişini FFmpeg üzerinden AAC olarak encode edip `live-audio.mpd` manifesti ile mevcut player akışında oynatılabilir hale getirmek.

**Architecture:** Varsayılan video-only akış korunur. `--audio` açıldığında startup planı `buildAudioCommand` kullanır, FFmpeg video cihazı ile mikrofon cihazını tek `avfoundation` input kaynağında birleştirir, DASH çıktısını `live-audio.mpd` olarak üretir. Player tarafında yeni UI eklenmez; mevcut manifest yükleme akışı korunur.

**Tech Stack:** TypeScript, Node.js, FFmpeg, avfoundation, DASH, Vitest, mevcut startup scriptleri ve proje dokümantasyonu.

---

## Dosya Haritası

- Modify: `src/server/ffmpeg/buildAudioCommand.ts`
- Modify: `src/server/startupSummary.ts`
- Modify: `tests/unit/buildAudioCommand.test.ts`
- Modify: `tests/unit/startupPlan.test.ts`
- Create: `tests/integration/audio-pipeline.test.ts`
- Modify: `README.md`
- Modify: `docs/project-checklist.md`

### Task 1: Audio FFmpeg Komutunu Doğru Kur

**Files:**

- Modify: `tests/unit/buildAudioCommand.test.ts`
- Modify: `src/server/ffmpeg/buildAudioCommand.ts`

- [ ] **Step 1: Write the failing test**

```ts
it("uses the configured audio device in the avfoundation input source", () => {
  const result = buildAudioCommand(config);

  expect(result.args).toContain("-i");
  expect(result.args).toContain("0:0");
  expect(result.args).toContain("-c:a");
  expect(result.args).toContain("aac");
  expect(result.args).toContain("-seg_duration");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/buildAudioCommand.test.ts`
Expected: FAIL because the command does not yet build the combined `videoDevice:audioDevice` source and may be missing DASH window flags.

- [ ] **Step 3: Write minimal implementation**

```ts
const videoDevice =
  config.capture.inputSource.split(":")[0] ?? config.capture.inputSource;
const combinedInputSource = `${videoDevice}:${config.capture.audioDevice}`;
const manifestPath = `${config.paths.dashRoot}/live-audio.mpd`;
const windowSize = Math.max(
  1,
  Math.floor(
    config.streaming.dvrWindowSeconds / config.streaming.segmentDurationSeconds,
  ),
);

return {
  command: "ffmpeg",
  manifestPath,
  args: [
    "-hide_banner",
    "-y",
    "-framerate",
    String(config.capture.frameRate),
    "-use_wallclock_as_timestamps",
    "1",
    "-f",
    config.capture.inputFormat,
    "-pixel_format",
    config.capture.pixelFormat,
    "-video_size",
    config.capture.videoSize,
    "-i",
    combinedInputSource,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-tune",
    "zerolatency",
    "-g",
    "30",
    "-keyint_min",
    "30",
    "-sc_threshold",
    "0",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-f",
    "dash",
    "-seg_duration",
    String(config.streaming.segmentDurationSeconds),
    "-window_size",
    String(windowSize),
    "-extra_window_size",
    "0",
    "-remove_at_exit",
    "0",
    manifestPath,
  ],
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/buildAudioCommand.test.ts`
Expected: PASS

### Task 2: Startup Akışında Audio Modunu Doğrula

**Files:**

- Modify: `tests/unit/startupPlan.test.ts`
- Create: `tests/integration/audio-pipeline.test.ts`
- Modify: `src/server/startupSummary.ts`

- [ ] **Step 1: Write the failing tests**

```ts
it("reports the audio manifest URL when audio mode is enabled", () => {
  const plan = createStartupPlan(config, "/workspace/project", { audio: true });

  expect(plan.manifestUrl).toBe("http://127.0.0.1:8080/dash/live-audio.mpd");
  expect(plan.ffmpeg.manifestPath).toBe("./output/dash/live-audio.mpd");
});
```

```ts
it("formats startup output with the audio manifest target", () => {
  const summary = formatStartupSummary(
    {
      nginxConfigPath: "configs/nginx/generated.conf",
      manifestPath: "./output/dash/live-audio.mpd",
    },
    createStartupPlan(config, "/workspace/project", { audio: true }),
  );

  expect(summary).toContain(
    "Manifest URL: http://127.0.0.1:8080/dash/live-audio.mpd",
  );
  expect(summary).toContain(
    "FFmpeg manifest target: ./output/dash/live-audio.mpd",
  );
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/unit/startupPlan.test.ts tests/integration/audio-pipeline.test.ts`
Expected: FAIL until the integration coverage exists and summary expectations are satisfied.

- [ ] **Step 3: Write minimal implementation**

```ts
return [
  `Generated NGINX config: ${bootstrap.nginxConfigPath}`,
  `FFmpeg manifest target: ${bootstrap.manifestPath}`,
  `Player URL: ${startupPlan.playerUrl}`,
  `Manifest URL: ${startupPlan.manifestUrl}`,
  `NGINX command: ${nginxCommand}`,
  `FFmpeg command: ${ffmpegCommand}`,
].join("\n");
```

Integration test body:

```ts
const plan = createStartupPlan(config, "/workspace/project", { audio: true });

expect(plan.ffmpeg.command).toBe("ffmpeg");
expect(plan.ffmpeg.args).toContain("-c:a");
expect(plan.ffmpeg.args).toContain("aac");
expect(plan.ffmpeg.args).toContain("0:0");
expect(plan.manifestUrl).toBe("http://127.0.0.1:8080/dash/live-audio.mpd");
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/unit/startupPlan.test.ts tests/integration/audio-pipeline.test.ts`
Expected: PASS

### Task 3: Audio Komutlarını ve Checklist’i Belgele

**Files:**

- Modify: `README.md`
- Modify: `docs/project-checklist.md`

- [ ] **Step 1: Write the failing documentation expectation**

Manual expectation before edit:

```md
- `npm run startup:audio`
- `make startup-audio`
- Audio mode requires `capture.audioDevice` to be configured.
```

- [ ] **Step 2: Update documentation minimally**

Add the audio startup command to `README.md` command lists and startup helper section. Mark these checklist items in `docs/project-checklist.md` only when code and test validation really pass:

```md
- [x] Add audio pipeline tests
- [x] Capture microphone input
- [x] Encode audio as AAC
```

Leave `Verify browser playback with audio` unchecked until a real local playback run is completed.

- [ ] **Step 3: Run targeted validation**

Run: `npm run test -- tests/unit/buildAudioCommand.test.ts tests/unit/startupPlan.test.ts tests/integration/audio-pipeline.test.ts`
Expected: PASS

### Task 4: Real Audio Playback Verification

**Files:**

- Modify: `docs/project-checklist.md`
- Modify: `README.md`

- [ ] **Step 1: Run the real audio stack**

Run:

```bash
npm run startup:audio
```

Expected: FFmpeg starts with AAC audio enabled and the summary prints a `live-audio.mpd` URL.

- [ ] **Step 2: Verify local browser playback**

Manual checks:

```text
Open the player URL.
Confirm live playback starts.
Confirm the manifest requested is /dash/live-audio.mpd.
Confirm the media element is not paused and currentTime advances.
```

- [ ] **Step 3: Update docs after real verification**

Only after the real run succeeds, mark this checklist item:

```md
- [x] Verify browser playback with audio
```

## Self-Review

- Spec coverage: audio remains optional, uses AAC, preserves baseline path, and includes checklist/doc updates.
- Placeholder scan: no `TODO` or `TBD` markers remain.
- Type consistency: file paths and function names match the current repository.
