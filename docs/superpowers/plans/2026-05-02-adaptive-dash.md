# Adaptive DASH Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mevcut canlı DASH hattına 3 representation'lı ABR yayın modunu ekleyip gerçek local manifest ve browser playback ile doğrulamak.

**Architecture:** ABR modu mevcut baseline ve audio akışlarından ayrı, explicit `--abr` / `startup:abr` yüzeyi üzerinden çalışır. `buildAbrCommand` multi-representation `live-abr.mpd` üretir; player mevcut `?manifest=` mekanizmasıyla bu manifesti açar. Son aşamada gerçek local run ile manifest ve browser playback doğrulanır.

**Tech Stack:** TypeScript, FFmpeg, NGINX, dash.js, Vitest, Playwright, Make/README/docs.

---

## Dosya Haritası

- Modify: `package.json`
- Modify: `Makefile`
- Modify: `README.md`
- Modify: `docs/project-checklist.md`
- Modify: `tests/unit/devOptions.test.ts`
- Modify: `tests/unit/startupPlan.test.ts`
- Modify: `tests/unit/startupSummary.test.ts`
- Modify: `tests/unit/listCaptureDevicesOptions.test.ts`
- Modify: `tests/unit/buildAbrCommand.test.ts`
- Modify: `tests/integration/abr-manifest.test.ts`

### Task 1: ABR Komut Yüzeyini Tamamla

**Files:**

- Modify: `tests/unit/devOptions.test.ts`
- Modify: `package.json`
- Modify: `Makefile`

- [ ] **Step 1: Write the failing tests**

Add expectations that the repo exposes a dedicated ABR startup command surface:

```ts
it("supports abr startup mode", () => {
  expect(parseDevOptions(["--abr"])).toEqual({
    configPath: "configs/app.example.json",
    startNginx: false,
    startFfmpeg: false,
    listDevices: false,
    audio: false,
    abr: true,
  });
});
```

And documentation-level expectation to satisfy by implementation:

```text
npm run startup:abr
make startup-abr
```

- [ ] **Step 2: Run focused tests to verify current gap**

Run: `npm run test -- tests/unit/devOptions.test.ts tests/unit/listCaptureDevicesOptions.test.ts`
Expected: parser tests pass or stay green, but command surface in `package.json` / `Makefile` is still missing ABR startup commands.

- [ ] **Step 3: Implement the minimal command surface**

Add:

```json
"startup:abr": "npm run build && tsx scripts/dev.ts --start-all --abr"
```

and the matching `make startup-abr` target plus help text.

- [ ] **Step 4: Re-run focused tests**

Run: `npm run test -- tests/unit/devOptions.test.ts tests/unit/listCaptureDevicesOptions.test.ts`
Expected: PASS

### Task 2: ABR Docs ve Checklist Yüzeyini Tamamla

**Files:**

- Modify: `README.md`
- Modify: `docs/project-checklist.md`

- [ ] **Step 1: Confirm current doc gap**

Before editing, verify the current docs do not yet expose `startup:abr` / `startup-abr` and ABR checklist items remain unchecked.

- [ ] **Step 2: Update README minimally**

Add the ABR startup command to the command lists and startup helper section in this shape:

```md
- `make startup-abr`
- Generate artifacts and start the adaptive DASH live stack: `npm run startup:abr`
```

Include a short note that ABR writes `live-abr.mpd` and uses the player URL printed by startup summary.

- [ ] **Step 3: Update checklist only for completed code/test work**

After code and tests are in place, mark these items complete:

```md
- [x] Add ABR FFmpeg command builder
- [x] Add ABR config file
- [x] Add ABR manifest tests
```

Leave these unchecked until real local verification:

```md
- [ ] Generate multi-representation DASH output
- [ ] Verify dash.js adaptation behavior
```

### Task 3: Real ABR Local Verification

**Files:**

- Modify: `docs/project-checklist.md`

- [ ] **Step 1: Run focused ABR tests first**

Run:

```bash
npm run test -- tests/unit/buildAbrCommand.test.ts tests/integration/abr-manifest.test.ts tests/unit/startupPlan.test.ts tests/unit/startupSummary.test.ts
```

Expected: PASS

- [ ] **Step 2: Start the real ABR stack**

Run:

```bash
npm run startup:stop
npm run startup:abr
```

Expected startup summary evidence:

```text
ABR mode: enabled
Manifest URL: http://127.0.0.1:<port>/dash/live-abr.mpd
```

- [ ] **Step 3: Verify the real ABR manifest and browser playback**

Collect real evidence that shows:

```text
1. /dash/live-abr.mpd is requested.
2. The manifest is reachable.
3. The manifest contains multiple representations.
4. The browser player opens using the printed player URL.
5. Playback starts from the ABR manifest.
```

- [ ] **Step 4: Update checklist from real ABR evidence**

Only after the real run succeeds, mark these complete:

```md
- [x] Generate multi-representation DASH output
- [x] Verify dash.js adaptation behavior
```

### Task 4: Final Verification For ABR Phase

**Files:**

- Modify only if needed based on verification findings

- [ ] **Step 1: Run repo-wide verification**

Run:

```bash
make lint
make typecheck
make test
make build
make e2e
```

Expected: all pass.

## Self-Review

- Spec coverage: builder, config, tests, command surface, docs, checklist, and real local verification are all covered.
- Placeholder scan: no `TODO` or `TBD` markers remain.
- Type consistency: current ABR-related file names and flags match the repository state discovered in the workspace.
