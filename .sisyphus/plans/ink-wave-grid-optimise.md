# InkWaveGrid — Performance Optimisation & Visual Tuning

## TL;DR

> **Quick Summary**: Fix four concrete performance issues in the InkWaveGrid canvas component, then tune the dot grid to be smaller and denser with values that scale responsively with canvas size so the component looks consistent across all screen widths.
>
> **Deliverables**:
> - `components/InkWaveGrid.tsx` — optimised and visually tuned in-place
>
> **Estimated Effort**: Quick  
> **Parallel Execution**: NO — single file, sequential tasks  
> **Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 → Task 5

---

## Context

### Original Request
Optimise the InkWaveGrid canvas component, then reduce dot size and increase dot density with responsive scaling.

### Interview Summary
**Key Discussions**:
- Scaling: responsive — `R` and `GAP` computed as a fraction of canvas width, not fixed pixel constants
- Density: moderate (~50–70% more dots vs current)
- DPR fix: include `devicePixelRatio` support so canvas is sharp on retina/HiDPI displays

**Research Findings**:
- Current: `GAP = 10`, `R = 2.5` (fixed). At 1440px: ~15,552 dots/frame. At 375px: ~1,036.
- Blob `baseR` is fixed (60–140px) — appears tiny on large canvases, dominant on small ones.
- Canvas ignores `devicePixelRatio` — blurry on retina displays.
- `noise2d` recomputes `Math.sqrt(3)` and allocates a closure every invocation.
- `fillStyle` string is allocated and CSS-parsed per dot inside the hot loop.

---

## Work Objectives

### Core Objective
Remove four concrete performance inefficiencies and tune the dot grid so the visual density and blob prominence are consistent across all screen sizes.

### Concrete Deliverables
- `components/InkWaveGrid.tsx` — all changes in this single file

### Definition of Done
- [ ] `pnpm lint` passes with no new errors
- [ ] `pnpm build` succeeds
- [ ] Visual inspection: canvas looks sharp on retina, blobs are proportionally consistent across viewport widths

### Must Have
- `F2` / `G2` constants hoisted to module level
- `dot()` helper extracted outside `noise2d`
- Per-dot `fillStyle` string removed from the hot loop; replaced with `globalAlpha`
- `devicePixelRatio` applied to canvas resolution
- `GAP` and `R` computed responsively from canvas width
- Blob `baseR` scaled relative to canvas width
- Moderate density increase: target ~50–70% more dots vs the current fixed `GAP = 10` baseline at a typical viewport

### Must NOT Have
- Do NOT change the visual character of the noise / wave algorithm (no tweaks to noise2d internals, frequencies, or blob shape logic)
- Do NOT change the component's external API, props, or class names
- Do NOT add new dependencies
- Do NOT touch any file other than `components/InkWaveGrid.tsx`
- Do NOT add `devicePixelRatio` scaling to the CSS display size — only to the canvas backing buffer resolution

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES (Playwright E2E)
- **Automated tests**: None added — visual/canvas animation; existing e2e suite covers smoke
- **Agent-Executed QA**: YES — lint + build commands, plus visual spot-check steps

### QA Policy
Verification is via lint, build, and agent-executed browser inspection.

---

## Execution Strategy

All tasks touch the same file and build on each other — strictly sequential.

```
Task 1 → Task 2 → Task 3 → Task 4 → Task 5
```

---

## TODOs

---

- [x] 1. Hoist `F2`/`G2` constants and extract `dot()` helper

  **What to do**:
  - Delete the two lines inside `noise2d` that compute `F2` and `G2` (`const F2 = 0.5 * (Math.sqrt(3) - 1)` and `const G2 = (3 - Math.sqrt(3)) / 6`)
  - Add them as module-level `const` declarations immediately after the `G` gradient array (around line 31)
  - Delete the inner `function dot(gi, xx, yy)` declaration from inside `noise2d`
  - Add `function dot(gi: number, xx: number, yy: number): number` as a module-level function, immediately before `noise2d`
  - The body of `dot` is unchanged: `const g = G[gi % 8]; return g[0] * xx + g[1] * yy;`
  - All three call sites inside `noise2d` (`dot(P[ii + P[jj]], x0, y0)` etc.) remain identical — only the declaration moves

  **Must NOT do**:
  - Do not change the algorithm logic, constants values, or noise output in any way
  - Do not touch anything outside the noise utility section of the file

  **Recommended Agent Profile**:
  > Simple mechanical code move — no logic change.
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential — Task 1 of 5
  - **Blocks**: Task 2, 3, 4, 5
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `components/InkWaveGrid.tsx:21-30` — `G` gradient array, insert new constants immediately after this block
  - `components/InkWaveGrid.tsx:32-72` — full `noise2d` function showing current positions of F2, G2, and inner `dot`

  **Acceptance Criteria**:
  - [ ] `F2` and `G2` are declared at module scope, not inside `noise2d`
  - [ ] `function dot` is declared at module scope, not inside `noise2d`
  - [ ] `noise2d` body still compiles and contains all three `dot(...)` call sites unchanged
  - [ ] `pnpm lint` passes

  **QA Scenarios**:
  ```
  Scenario: Build succeeds after refactor
    Tool: Bash
    Steps:
      1. Run: pnpm lint
      2. Run: pnpm build
    Expected Result: Both commands exit 0 with no errors mentioning InkWaveGrid
    Evidence: .sisyphus/evidence/task-1-build.txt
  ```

  **Commit**: YES (groups with Task 2)
  - Message: `perf(InkWaveGrid): hoist noise constants and extract dot helper`
  - Files: `components/InkWaveGrid.tsx`

---

- [x] 2. Replace per-dot `fillStyle` string with `globalAlpha`

  **What to do**:
  - Before the outer `for (let col = 0...)` loop, add: `ctx.fillStyle = '#000';`
  - Inside the inner loop, replace `ctx.fillStyle = \`rgba(0,0,0,${opacity})\`` with `ctx.globalAlpha = opacity;`
  - After the two closing `}` of the nested loops (but before `tRef.current += 0.008`), add: `ctx.globalAlpha = 1;` to reset the context state
  - Remove the `rgba(...)` template literal entirely — it should not appear anywhere in the draw loop

  **Must NOT do**:
  - Do not change the `opacity` calculation logic
  - Do not remove `ctx.beginPath()`, `ctx.arc()`, or `ctx.fill()` calls
  - Do not change any value outside the fillStyle → globalAlpha swap

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential — Task 2 of 5
  - **Blocks**: Task 3, 4, 5
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `components/InkWaveGrid.tsx:154-189` — the full `draw` callback showing the hot loop

  **Acceptance Criteria**:
  - [ ] No `rgba(` string appears inside the `draw` function
  - [ ] `ctx.fillStyle = '#000'` appears once, outside/before the nested loops
  - [ ] `ctx.globalAlpha = opacity` appears once, inside the inner loop
  - [ ] `ctx.globalAlpha = 1` appears once, after the loops
  - [ ] `pnpm lint` passes

  **QA Scenarios**:
  ```
  Scenario: Build succeeds and no rgba string in draw loop
    Tool: Bash
    Steps:
      1. Run: pnpm lint
      2. Run: grep -n "rgba" components/InkWaveGrid.tsx
    Expected Result: lint exits 0; grep returns no matches inside the draw function
    Evidence: .sisyphus/evidence/task-2-build.txt
  ```

  **Commit**: YES (commit Tasks 1+2 together)
  - Message: `perf(InkWaveGrid): hoist noise constants and batch fillStyle`
  - Files: `components/InkWaveGrid.tsx`

---

- [x] 3. Add `devicePixelRatio` support

  **What to do**:
  - In the `resize` callback, after computing `w` and `h` (the logical canvas dimensions), read `const dpr = window.devicePixelRatio || 1`
  - Set the canvas *backing buffer* to physical pixels: `canvas.width = w * dpr; canvas.height = h * dpr;`
  - Store `dpr` alongside the other size values: update `sizeRef.current = { cols, rows, w, h, dpr }`
  - Update the `sizeRef` type annotation (the anonymous object) to include `dpr: number` — also update the destructuring in `draw` to pull `dpr` out
  - In the `draw` callback, after getting `ctx`, add: `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` as the very first operation before `ctx.clearRect`
  - Do NOT change the CSS `canvas.style.width` or `canvas.style.height` — the Tailwind `w-full` and `height: auto` classes handle display size; only the backing buffer resolution changes
  - The `clearRect` call should remain `ctx.clearRect(0, 0, w, h)` — it operates in logical (CSS) pixels after `setTransform`

  **Must NOT do**:
  - Do not set `canvas.style.width` or `canvas.style.height` inline — these are controlled by Tailwind
  - Do not change the click coordinate scaling logic (it already handles CSS→canvas coordinate mapping via `rect.width`)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential — Task 3 of 5
  - **Blocks**: Task 4, 5
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `components/InkWaveGrid.tsx:138-152` — `resize` callback
  - `components/InkWaveGrid.tsx:154-189` — `draw` callback

  **External References**:
  - MDN Canvas HiDPI pattern: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays

  **Acceptance Criteria**:
  - [ ] `canvas.width` and `canvas.height` are set to `w * dpr` and `h * dpr` respectively in `resize`
  - [ ] `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` is called at the top of `draw`
  - [ ] `sizeRef.current` includes a `dpr` field
  - [ ] `pnpm lint` passes

  **QA Scenarios**:
  ```
  Scenario: Build succeeds with DPR changes
    Tool: Bash
    Steps:
      1. Run: pnpm lint
      2. Run: pnpm build
    Expected Result: Both exit 0 with no errors
    Evidence: .sisyphus/evidence/task-3-build.txt
  ```

  **Commit**: YES
  - Message: `perf(InkWaveGrid): add devicePixelRatio support for sharp retina rendering`
  - Files: `components/InkWaveGrid.tsx`

---

- [x] 4. Make `GAP`, `R`, and blob `baseR` responsive to canvas width

  **What to do**:
  - Remove the module-level `const GAP = 10` and `const R = 2.5` declarations entirely
  - Add a single module-level constant to control the dot grid density: `const DOTS_PER_WIDTH = 90` — this is the target number of dot columns at any canvas width. Adjust this number to achieve ~50-70% more dots than the current `GAP=10` baseline. At 375px width, `GAP=10` gives 37 cols; target is ~55-65 cols → `DOTS_PER_WIDTH = 60` is a good starting value.
  - In the `resize` callback, after `containerW` is computed, derive the responsive values:
    ```ts
    const gap = Math.max(6, Math.round(containerW / DOTS_PER_WIDTH));
    const r = Math.max(1, gap * 0.22);
    ```
  - Store `gap` and `r` in `sizeRef.current` alongside `cols`, `rows`, `w`, `h`, `dpr`
  - Update all usages of `GAP` inside `resize` (the `cols` and `rows` calculations, and the `w`/`h` pixel dimensions) to use the local `gap` variable
  - In the `draw` callback, destructure `gap` and `r` from `sizeRef.current`
  - Replace all remaining usages of `GAP` in `draw` (the `cx`/`cy` offset calculations) with `gap`
  - Replace the `R` constant in the `ctx.arc(cx, cy, R, ...)` call with `r`
  - In `makeBlob`: remove the hardcoded `60 + Math.random() * 80` and replace with a `canvasW` parameter:
    - Change signature to `makeBlob(x: number, y: number, canvasW: number): Blob`
    - Replace `const baseR = 60 + Math.random() * 80` with `const baseR = canvasW * (0.08 + Math.random() * 0.12)` — this gives 8–20% of canvas width
  - In the `handleClick` inside `useEffect`, update the `makeBlob` call to pass `sizeRef.current.w` as the third argument

  **Must NOT do**:
  - Do not change blob shape logic, lobe count, angle/radii arrays, or anything in `blobRadius` / `blobInfluence`
  - Do not change the `coastWave` function
  - Do not change any noise constants
  - The `DOTS_PER_WIDTH` constant is the single knob to turn — do not add more tuning constants

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential — Task 4 of 5
  - **Blocks**: Task 5
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `components/InkWaveGrid.tsx:5-7` — current `GAP`, `R`, `ASPECT` constants
  - `components/InkWaveGrid.tsx:84-94` — `makeBlob` function
  - `components/InkWaveGrid.tsx:138-152` — `resize` callback where `cols`/`rows`/`w`/`h` are derived
  - `components/InkWaveGrid.tsx:165-183` — hot loop using `GAP` and `R`
  - `components/InkWaveGrid.tsx:198-203` — `handleClick` calling `makeBlob`

  **Acceptance Criteria**:
  - [ ] Module-level `GAP` and `R` constants are gone
  - [ ] `DOTS_PER_WIDTH` module-level constant exists
  - [ ] `gap` and `r` are stored in `sizeRef.current`
  - [ ] `makeBlob` accepts a third `canvasW: number` parameter
  - [ ] `pnpm lint` passes (no references to undefined `GAP` or `R`)

  **QA Scenarios**:
  ```
  Scenario: No orphaned GAP or R references
    Tool: Bash
    Steps:
      1. Run: grep -n "\bGAP\b\|\bconst R\b" components/InkWaveGrid.tsx
      2. Run: pnpm lint
      3. Run: pnpm build
    Expected Result: grep returns no matches; lint and build exit 0
    Evidence: .sisyphus/evidence/task-4-build.txt
  ```

  **Commit**: YES
  - Message: `feat(InkWaveGrid): responsive dot size and density, scale blob radius to canvas width`
  - Files: `components/InkWaveGrid.tsx`

---

- [x] 5. Final integration verification

  **What to do**:
  - Run the full lint + build pipeline
  - Start the dev server and open the demo page in a browser to visually verify:
    1. Dots are visibly smaller and denser than before
    2. Clicking produces ink blobs that are proportionally sized (not tiny slivers on a wide screen)
    3. On a retina display or with browser zoom >100%, the canvas is sharp (not blurry)
    4. Resizing the browser window causes the grid to recompute correctly

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential — Task 5 of 5
  - **Blocks**: nothing
  - **Blocked By**: Task 4

  **References**:
  - `components/InkWaveGrid.tsx` — the finished file

  **Acceptance Criteria**:
  - [ ] `pnpm lint` exits 0
  - [ ] `pnpm build` exits 0 with no errors or type errors referencing InkWaveGrid

  **QA Scenarios**:
  ```
  Scenario: Full pipeline passes
    Tool: Bash
    Steps:
      1. Run: pnpm lint
      2. Run: pnpm build
    Expected Result: Both commands exit 0
    Evidence: .sisyphus/evidence/task-5-final.txt

  Scenario: Visual spot-check — dot grid is denser and blobs scale with canvas
    Tool: Bash (dev server) + manual observation
    Steps:
      1. Run: pnpm dev (background)
      2. Open http://localhost:3000/projects (or whichever page hosts the demo)
      3. Observe: dots are visibly smaller/denser vs baseline
      4. Click canvas: blob radius looks proportional to canvas width
      5. Resize browser from 375px to 1440px: blob stays proportional
    Expected Result: Consistent visual density across viewport widths
    Evidence: .sisyphus/evidence/task-5-visual-notes.txt
  ```

  **Commit**: NO (verification only)

---

## Final Verification Wave

- [x] F1. **Plan Compliance Audit** — `oracle`
  Verify all Must Have items are present in the final file. Verify all Must NOT Have items are absent (no `const GAP`, no `const R = 2.5`, no `rgba(` in draw loop, no style overrides on canvas element). Check evidence files exist.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm lint` and `pnpm build`. Scan the file for: `as any`, empty catches, unused imports, leftover `console.log`. Verify no reference to the old `GAP` or `R` constants remains.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | VERDICT`

---

## Commit Strategy

- Tasks 1+2: `perf(InkWaveGrid): hoist noise constants, extract dot helper, batch fillStyle`
- Task 3: `perf(InkWaveGrid): add devicePixelRatio support for sharp retina rendering`
- Task 4: `feat(InkWaveGrid): responsive dot size/density and canvas-relative blob radius`

---

## Success Criteria

### Verification Commands
```bash
pnpm lint      # Expected: exit 0, no errors
pnpm build     # Expected: exit 0, no type errors
grep -n "rgba(" components/InkWaveGrid.tsx  # Expected: no matches inside draw loop
grep -n "\bGAP\b\|const R " components/InkWaveGrid.tsx  # Expected: no matches
```

### Final Checklist
- [ ] `F2`, `G2` at module level
- [ ] `dot()` at module level
- [ ] No per-dot `fillStyle` string in hot loop
- [ ] `devicePixelRatio` applied to canvas backing buffer
- [ ] `GAP` and `R` replaced by responsive `gap` and `r` derived from `DOTS_PER_WIDTH`
- [ ] Blob `baseR` scales with `canvasW`
- [ ] All tests/lint/build pass
