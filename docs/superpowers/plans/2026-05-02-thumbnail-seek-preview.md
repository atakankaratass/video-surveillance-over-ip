# Thumbnail Seek Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Baseline `live.mpd` akışı için server-side thumbnail artefact üretip seek hover sırasında preview gösteren masaüstü odaklı bir thumbnail preview özelliği eklemek.

**Architecture:** Ayrı bir thumbnail sidecar üretim akışı, baseline DASH manifestinden thumbnail artefact'ları üretir. Player metadata JSON ve sprite image'i okuyup seek slider hover anında en yakın preview'ü gösterir; artefact yoksa player normal seek davranışına sessizce döner.

**Tech Stack:** TypeScript, Node.js, FFmpeg, NGINX, dash.js, Vitest, Playwright.

---

## Dosya Haritası

- Create: `src/server/thumbnails/metadata.ts`
- Create: `src/server/thumbnails/spriteSheet.ts`
- Create: `src/server/thumbnails/service.ts`
- Create: `scripts/generate-thumbnails.ts`
- Create: `src/player/thumbnails.ts`
- Modify: `src/player/playerShell.ts`
- Modify: `src/player/main.ts`
- Modify: `package.json`
- Modify: `Makefile`
- Modify: `README.md`
- Modify: `docs/project-checklist.md`
- Test: `tests/unit/thumbnail-metadata.test.ts`
- Test: `tests/unit/thumbnail-preview.test.ts`
- Test: `tests/e2e/thumbnail-preview.spec.ts`

### Task 1: Thumbnail Metadata ve Preview State Yardımcılarını Ekле

**Files:**

- Create: `tests/unit/thumbnail-metadata.test.ts`
- Create: `tests/unit/thumbnail-preview.test.ts`
- Create: `src/server/thumbnails/metadata.ts`
- Create: `src/player/thumbnails.ts`

- [ ] **Step 1: Write the failing tests**

Metadata tarafında şu davranışları test et:

```ts
it("selects the closest thumbnail entry for a target time", () => {
  expect(findClosestThumbnailEntry(entries, 14)).toEqual(entries[1]);
});
```

Player preview tarafında şu davranışları test et:

```ts
it("hides preview when metadata is unavailable", () => {
  expect(getThumbnailPreviewState(null, 25, 0, 30)).toEqual({ visible: false });
});
```

```ts
it("returns visible preview data for a hover position", () => {
  expect(getThumbnailPreviewState(metadata, 50, 0, 30)).toMatchObject({
    visible: true,
    imageUrl: "/thumbnails/sprite.jpg",
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/unit/thumbnail-metadata.test.ts tests/unit/thumbnail-preview.test.ts`
Expected: FAIL because the thumbnail helper modules do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Implement:

- a metadata type with entries carrying `timeSeconds`, `x`, `y`, `width`, `height`, `imageUrl`
- a helper that chooses the closest thumbnail entry by target time
- a player helper that maps hover percentage + seek window to preview state

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/unit/thumbnail-metadata.test.ts tests/unit/thumbnail-preview.test.ts`
Expected: PASS

### Task 2: Thumbnail Artefact Generation Sidecarını Ekле

**Files:**

- Create: `src/server/thumbnails/spriteSheet.ts`
- Create: `src/server/thumbnails/service.ts`
- Create: `scripts/generate-thumbnails.ts`

- [ ] **Step 1: Add one failing metadata generation test**

Create a test that expects the service to produce deterministic sprite metadata from generated frames, for example:

```ts
it("builds sprite metadata for a horizontal sheet", () => {
  expect(
    buildSpriteMetadata({
      imageUrl: "/thumbnails/sprite.jpg",
      frameWidth: 160,
      frameHeight: 90,
      intervalSeconds: 10,
      frameCount: 4,
    }).entries,
  ).toHaveLength(4);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/unit/thumbnail-metadata.test.ts`
Expected: FAIL for the new sprite metadata behavior.

- [ ] **Step 3: Write minimal implementation**

Implement a sidecar workflow that:

- derives a thumbnail manifest URL from the current baseline player URL or local server config
- runs FFmpeg against `http://127.0.0.1:<port>/dash/live.mpd`
- extracts a small batch of thumbnail JPEG frames at `thumbnails.intervalSeconds`
- packs those frames into a simple horizontal sprite sheet
- writes a matching metadata JSON file under a static `output/thumbnails/` directory

Keep the first version simple:

- single sprite image
- single metadata JSON
- best-effort regeneration
- no ABR/audio support

- [ ] **Step 4: Run the focused test again**

Run: `npm run test -- tests/unit/thumbnail-metadata.test.ts`
Expected: PASS

### Task 3: Player Hover Preview UI'yi Bağla

**Files:**

- Modify: `src/player/playerShell.ts`
- Modify: `src/player/main.ts`
- Create: `tests/e2e/thumbnail-preview.spec.ts`

- [ ] **Step 1: Write the failing browser test**

Add a Playwright test in this shape:

```ts
test("shows a thumbnail preview when hovering over the seek slider", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("seek-slider").hover();
  await expect(page.getByTestId("thumbnail-preview")).toBeVisible();
});
```

Use fixture/setup as needed so the page can see a metadata JSON and sprite file.

- [ ] **Step 2: Run the browser test to verify it fails**

Run: `npm run e2e -- tests/e2e/thumbnail-preview.spec.ts`
Expected: FAIL because the preview UI does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Implement:

- thumbnail preview container markup in the player shell
- metadata fetch on player startup
- mouse hover handling for the seek slider
- preview positioning and background crop styling
- graceful hidden state when no metadata exists

- [ ] **Step 4: Run the browser test to verify it passes**

Run: `npm run e2e -- tests/e2e/thumbnail-preview.spec.ts`
Expected: PASS

### Task 4: Command Surface, Docs ve Real Local Verification

**Files:**

- Modify: `package.json`
- Modify: `Makefile`
- Modify: `README.md`
- Modify: `docs/project-checklist.md`

- [ ] **Step 1: Add the thumbnail generation command surface**

Add:

```json
"thumbnails:generate": "tsx scripts/generate-thumbnails.ts"
```

and the matching `make thumbnails-generate` target.

- [ ] **Step 2: Update docs minimally**

Document:

- how to generate thumbnail artefacts
- that the first version is baseline-only
- that hover preview is desktop-only

- [ ] **Step 3: Run real local verification**

Run the baseline stack and then the thumbnail generator. Collect evidence that:

- thumbnail sprite exists
- thumbnail metadata exists
- browser hover shows preview
- seek/go-live still work

- [ ] **Step 4: Update checklist after real verification**

Only after the real run succeeds, mark these complete:

```md
- [x] Add thumbnail generation service
- [x] Add thumbnail metadata service
- [x] Add thumbnail player UI module
- [x] Add thumbnail metadata tests
- [x] Add thumbnail preview browser test
```

### Task 5: Final Verification

**Files:**

- Modify only if verification findings require it

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

- Spec coverage: sidecar artefact generation, metadata, hover preview UI, docs, tests and real local verification are all covered.
- Placeholder scan: no `TODO` or `TBD` markers remain.
- Type consistency: file paths and command names match the intended thumbnail scope for this repository.
