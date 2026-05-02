# Submission Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Report hariç teslim yüzeyini gerçek kanıt, güncel dokümantasyon ve submission checklist ile hazır hale getirmek.

**Architecture:** Mevcut runtime ve player akışı korunur. Bu plan, gerçek sistem doğrulaması ile repo dokümanlarını hizalar; gerektiğinde küçük kod değişiklikleri TDD ile yapılır, ardından demo runbook, compliance ve submission belgeleri gerçek doğrulama çıktısına göre güncellenir.

**Tech Stack:** TypeScript, Node.js, FFmpeg, NGINX, DASH, Playwright, Vitest, Markdown dokümantasyonu.

---

## Dosya Haritası

- Modify: `README.md`
- Modify: `docs/demo-runbook.md`
- Modify: `docs/project-checklist.md`
- Modify: `docs/assignment-compliance.md`
- Modify: `docs/report-outline.md`
- Create: `docs/submission-checklist.md`
- Create: `docs/sdk-and-open-source-disclosure.md`
- Optional Modify: `scripts/demo-check.ts`
- Optional Modify: `tests/unit/demoCheck.test.ts`

### Task 1: Demo Readiness Yüzeyini Gerçek Akışla Hizala

**Files:**

- Modify: `tests/unit/demoCheck.test.ts`
- Optional Modify: `scripts/demo-check.ts`
- Modify: `README.md`

- [ ] **Step 1: Write the failing test**

`tests/unit/demoCheck.test.ts` içine, demo readiness çıktısının preflight olduğunu netleştiren bir test ekle:

```ts
it("describes demo-check as a preflight readiness check instead of full live proof", () => {
  const report = formatDemoCheckReport({
    environmentReady: true,
    demoReady: true,
    issues: [],
  });

  expect(report).toContain("Preflight readiness");
  expect(report).not.toContain("Full live demo proof");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/demoCheck.test.ts`
Expected: FAIL because current demo-check wording does not yet distinguish preflight from full live proof.

- [ ] **Step 3: Write minimal implementation**

If the current script/report text is ambiguous, update only the wording that prints the summary so it clearly states that `demo-check` is a preflight signal, not the full live-demo proof.

Use wording in this shape:

```ts
"Preflight readiness: READY";
```

and avoid wording that implies full manual verification is already complete.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/demoCheck.test.ts`
Expected: PASS

- [ ] **Step 5: Update README minimally**

In `README.md`, update the current phase/status and demo-check description so they match the real project state.

Required edits:

```md
## Current Phase

Phase 3: real local streaming validation and submission-readiness preparation.
```

and clarify:

```md
This command is a preflight readiness check. It does not replace real local playback and control verification.
```

- [ ] **Step 6: Run targeted verification**

Run: `npm run test -- tests/unit/demoCheck.test.ts`
Expected: PASS

### Task 2: Exact Demo Runbook Yaz

**Files:**

- Modify: `docs/demo-runbook.md`
- Modify: `docs/project-checklist.md`

- [ ] **Step 1: Write the failing documentation expectation**

Before editing, confirm the runbook is missing these concrete items:

```md
1. `make validate-env`
2. `make list-devices`
3. `make demo-check`
4. `make startup-all`
5. Browser verification steps for manifest, controls, screenshot
6. iOS limitation and Android/desktop recommendation
7. Remote demo fallback and screen-share fallback
```

- [ ] **Step 2: Replace the loose demo sequence with the exact launch sequence**

Update `docs/demo-runbook.md` so the canonical path uses `make` commands, not raw `tsx` commands, in this order:

```md
1. Run `make validate-env`.
2. Run `make list-devices` and confirm the correct device IDs.
3. Update local config if the selected camera or microphone differs.
4. Run `make demo-check` as a preflight check.
5. Run `make startup-all` for the baseline demo, or `make startup-audio` if showing the audio extra-credit path.
6. Open the printed player URL in the browser.
7. Verify the manifest loads and playback begins.
8. Demonstrate pause, seek, go-live, and screenshot.
```

- [ ] **Step 3: Add explicit manual verification steps**

Add a section that tells the operator to confirm:

```md
- the browser requests `/dash/live.mpd` or `/dash/live-audio.mpd`
- segments continue to appear under `output/dash/`
- pause freezes playback
- seek rewinds to an older position
- go-live returns to the live edge
- screenshot creates an image file
```

- [ ] **Step 4: Add platform and fallback notes**

Add these exact ideas to the runbook:

```md
- iOS Safari does not support DASH playback for this assignment path.
- Desktop browsers and Android are the recommended demo targets.
- If the remote browser path fails, fall back to screen sharing the live browser session.
```

- [ ] **Step 5: Update checklist only for completed documentation work**

In `docs/project-checklist.md`, mark these items complete only after the runbook text actually exists:

```md
- [x] Expand demo runbook with exact launch sequence
- [x] Document iOS limitation explicitly in final demo docs
- [x] Document Android/desktop recommendation explicitly
```

Leave screenshot verification unchecked until Task 3 completes.

- [ ] **Step 6: Read back the runbook for consistency**

Manually verify that `docs/demo-runbook.md` no longer claims “Not Yet Complete” for any flow already proven elsewhere.

### Task 3: Real Demo Evidence ve Compliance Maddelerini Kapat

**Files:**

- Modify: `docs/project-checklist.md`
- Modify: `docs/assignment-compliance.md`
- Modify: `README.md`

- [ ] **Step 1: Run the preflight and local validation commands**

Run:

```bash
make lint
make typecheck
make test
make build
make e2e
make demo-check
```

Expected:

- lint/typecheck/test/build/e2e all pass
- demo-check reports readiness but is treated as preflight only

- [ ] **Step 2: Run the real live stack and collect evidence**

Run the baseline live stack:

```bash
make startup-stop
make startup-all
```

Then verify manually or with a small browser check that:

```text
1. The player URL opens.
2. The manifest is requested.
3. Playback starts.
4. Pause works.
5. Seek works.
6. Go Live works.
7. Screenshot saves an image.
```

- [ ] **Step 3: Update project checklist from real evidence**

Only after the real run succeeds, mark these items complete in `docs/project-checklist.md`:

```md
- [x] Verify webcam detection path for demo machine
- [x] Verify screenshot in the real demo flow
- [x] Webcam capture exists in the real pipeline
- [x] Real-time encoding exists in the real pipeline
- [x] Server-side storage exists in the real pipeline
- [x] HTTP delivery exists in the real pipeline
- [x] DASH live profile exists in the real pipeline
- [x] HTML5 MSE + JavaScript playback is working
- [x] No plugin-based player is used
- [x] Required seek control is working against real live output
- [x] Required pause control is working against real live output
- [x] Required go-live control is working against real live output
- [x] Required screenshot control is working against real live output
- [x] Segment tests for 2/4/6 seconds are complete
- [x] Latency measurements for 2/4/6 seconds are complete
- [x] Optional features implemented for extra credit
```

- [ ] **Step 4: Update assignment compliance from the same evidence**

Mark the corresponding items in `docs/assignment-compliance.md` complete when already proven by the real run and existing latency/audio evidence:

```md
- [x] FFmpeg used for capture and encoding
- [x] Real-time encoded content stored on the server
- [x] HTTP delivery in DASH live profile
- [x] HTML5 player uses MSE and JavaScript only
- [x] No browser plug-ins used
- [x] Required controls implemented
- [x] H.264/AVC used for video
- [x] Segment durations 2, 4, and 6 tested
- [x] Latency measured and documented
- [x] No hardcoded system-specific parameters
```

Leave `Report includes SDK and open-source usage disclosure` unchecked until the final report phase.

- [ ] **Step 5: Re-run full verification after doc updates**

Run:

```bash
make lint
make typecheck
make test
make build
make e2e
```

Expected: all commands pass again after the documentation-alignment changes.

### Task 4: Submission Checklist ve Disclosure Hazırlığı

**Files:**

- Create: `docs/submission-checklist.md`
- Create: `docs/sdk-and-open-source-disclosure.md`
- Modify: `docs/project-checklist.md`
- Modify: `docs/report-outline.md`
- Modify: `README.md`

- [ ] **Step 1: Create the submission checklist document**

Create `docs/submission-checklist.md` with content in this shape:

```md
# Submission Checklist

- [ ] Create final report
- [ ] Ensure final report stays within roughly 1-2 pages
- [ ] Include SDK/open-source disclosure in the report
- [ ] Capture required screenshots
- [ ] Include code, results, report, and docs in the final zip
- [ ] Name the zip `lastname(s)_project2.zip`
- [ ] Verify the zip opens and contains the expected files
```

- [ ] **Step 2: Create the disclosure preparation document**

Create `docs/sdk-and-open-source-disclosure.md` with a short structured list that the final report can later copy from. Include at least these headings:

```md
# SDK And Open-Source Disclosure Draft

## Libraries And Tools Used

## Where Each One Was Used

## Notes For Final Report Transfer
```

Populate it using the current project reality, for example `dash.js`, Playwright, Vitest, Vite, ESLint, Husky, FFmpeg, and NGINX where applicable.

- [ ] **Step 3: Link the new docs from existing surfaces**

Update `README.md` and `docs/report-outline.md` so these new docs are discoverable and clearly described as preparation for the final report/submission step.

- [ ] **Step 4: Update project checklist for the new prep docs**

In `docs/project-checklist.md`, mark these items complete only after the files exist with meaningful content:

```md
- [x] Prepare submission zip contents checklist
- [x] Prepare SDK/open-source usage disclosure list
```

Do not mark `Final report completed`, `Screenshots captured for report`, or `Submission bundle prepared` yet.

- [ ] **Step 5: Run final repo-wide verification for this phase**

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

- Spec coverage: demo verification, demo docs, compliance/docs alignment, submission checklist, disclosure prep, and report-last constraint are all covered.
- Placeholder scan: no `TODO` or `TBD` placeholders remain.
- Type consistency: file names and commands match the current repository structure.
