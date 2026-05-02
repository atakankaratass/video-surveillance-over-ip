# Motion Detection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Baseline live stream için server-side motion detection ve player içinde motion notification göstergesi eklemek.

**Architecture:** Ayrı bir motion sidecar, baseline DASH video segmentlerinden küçük grayscale frame çıkarır ve önceki frame ile farkını hesaplar. Sonuç motion status JSON olarak yazılır; player bunu poll ederek hafif bir notification gösterir.

**Tech Stack:** TypeScript, Node.js, FFmpeg, Vitest, Playwright.

---

## Dosya Haritası

- Create: `src/server/motion/detectMotion.ts`
- Create: `src/server/motion/service.ts`
- Create: `src/server/notifications/events.ts`
- Create: `scripts/run-motion-detection.ts`
- Create: `src/player/notifications.ts`
- Modify: `src/player/playerShell.ts`
- Modify: `src/player/main.ts`
- Modify: `package.json`
- Modify: `Makefile`
- Modify: `README.md`
- Modify: `docs/project-checklist.md`
- Modify: `docs/assignment-compliance.md`
- Test: `tests/unit/detectMotion.test.ts`
- Test: `tests/integration/motion-service.test.ts`
- Test: `tests/e2e/motion-notification.spec.ts`

### Task 1: Motion Difference Core

**Files:**

- Create: `tests/unit/detectMotion.test.ts`
- Create: `src/server/motion/detectMotion.ts`

- [ ] **Step 1: Write the failing tests**

Add tests for:

```ts
it("returns zero difference for identical frames", () => {
  expect(calculateMotionScore(frameA, frameA)).toBe(0);
});
```

```ts
it("detects motion when score exceeds threshold", () => {
  expect(isMotionDetected(0.3, 0.2)).toBe(true);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/unit/detectMotion.test.ts`
Expected: FAIL because the module does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Implement:

- average absolute byte difference score between two grayscale frames
- threshold comparison helper

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/unit/detectMotion.test.ts`
Expected: PASS

### Task 2: Motion Service Sidecar

**Files:**

- Create: `src/server/motion/service.ts`
- Create: `src/server/notifications/events.ts`
- Create: `scripts/run-motion-detection.ts`
- Create: `tests/integration/motion-service.test.ts`

- [ ] **Step 1: Write the failing integration test**

Test that the motion service can produce a status payload in this shape:

```ts
it("builds a motion status event payload", async () => {
  expect(result).toEqual({
    detected: true,
    score: 0.4,
  });
});
```

- [ ] **Step 2: Run the integration test to verify it fails**

Run: `npm run test -- tests/integration/motion-service.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Implement a sidecar workflow that:

- selects the latest baseline video segment
- extracts a tiny grayscale raw frame with FFmpeg
- compares it to the previous frame
- writes a motion status JSON file under `/dash/motion/`

- [ ] **Step 4: Run the integration test again**

Run: `npm run test -- tests/integration/motion-service.test.ts`
Expected: PASS

### Task 3: Player Motion Notification UI

**Files:**

- Create: `src/player/notifications.ts`
- Modify: `src/player/playerShell.ts`
- Modify: `src/player/main.ts`
- Create: `tests/e2e/motion-notification.spec.ts`

- [ ] **Step 1: Write the failing browser test**

Add a test in this shape:

```ts
test("shows motion notification when motion status reports detection", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByTestId("motion-notification")).toBeVisible();
});
```

- [ ] **Step 2: Run the browser test to verify it fails**

Run: `npm run build && npx playwright test tests/e2e/motion-notification.spec.ts`
Expected: FAIL because the UI does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Implement:

- notification container markup
- small polling helper for motion status JSON
- show/hide logic for detected motion

- [ ] **Step 4: Run the browser test to verify it passes**

Run: `npm run build && npx playwright test tests/e2e/motion-notification.spec.ts`
Expected: PASS

### Task 4: Command Surface, Docs ve Real Local Verification

**Files:**

- Modify: `package.json`
- Modify: `Makefile`
- Modify: `README.md`
- Modify: `docs/project-checklist.md`
- Modify: `docs/assignment-compliance.md`

- [ ] **Step 1: Add motion command surface**

Add:

```json
"motion:run": "tsx scripts/run-motion-detection.ts"
```

and matching `make motion-run` target.

- [ ] **Step 2: Update docs minimally**

Document:

- baseline-only scope
- how to run motion detection
- where motion status artifacts are written

- [ ] **Step 3: Run real local verification**

Verify:

- live baseline stack works
- motion status JSON is produced
- browser notification appears when motion is detected

- [ ] **Step 4: Update checklist after real verification**

Only after real verification, mark complete:

```md
- [x] Add motion detection core
- [x] Add motion service
- [x] Add viewer notification event model
- [x] Add motion detection tests
- [x] Render motion notification UI
```

Also mark `Motion detection with viewer notifications` complete in `docs/assignment-compliance.md`.

### Task 5: Final Verification

- [ ] **Step 1: Run repo-wide validation**

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

- Spec coverage: core motion logic, sidecar service, player UI, docs and real verification are covered.
- Placeholder scan: no `TODO` or `TBD` markers remain.
- Type consistency: file names and command names match the planned repository shape.
