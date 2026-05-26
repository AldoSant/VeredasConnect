# VeredasConnect Six-Hour Local-First Implementation Plan

> **For Hermes:** Use durable background development with local-model-delegation. Implement task-by-task with small diffs, validation gates, and local commits only when verified.

**Goal:** Spend up to six continuous hours improving VeredasConnect safely, with emphasis on launch readiness, accessibility, validation, testing, documentation, and deploy confidence.

**Architecture:** Keep the existing Next.js/App Router structure. Prefer small helper functions in `src/lib`, focused component fixes in `src/components`, and tests near existing Vitest suites. Avoid large rewrites and preserve the existing `/connect` basePath behavior.

**Tech Stack:** Next.js 15, React 19, TypeScript, Drizzle, NextAuth beta, Biome, Vitest, shell E2E scripts.

---

## Non-negotiable safety rules

- No `git push`.
- No external deploy.
- No production migrations.
- No destructive git commands such as `git reset --hard`, branch rewriting, or broad cleanup.
- No secret exposure. Redact secrets as `[REDACTED]` in all logs/reports.
- Keep changes small and reviewable.
- Run validation after meaningful changes.
- If a change breaks lint/build/tests and cannot be fixed quickly, revert only that small change with `git checkout -- <file>` or an equivalent targeted patch, then continue with another task.
- Local commits are allowed after validated coherent task groups; never push them.

## Baseline commands

Run first:

```bash
git status --short --branch
npm run lint
npm run test:run
npm run build
```

For E2E, start a dev server first:

```bash
npm run dev
# wait until http://localhost:3000/connect is ready
npm run test:e2e
# stop dev server
```

## Work lanes and bite-sized tasks

### Lane A — Workspace/build hygiene

#### Task A1: Fix or document Next.js multiple-lockfile warning
**Objective:** Reduce or clearly document the Next.js workspace-root warning seen during build.

**Files:**
- Inspect: `next.config.ts` or `next.config.js`
- Inspect: `/home/annaa/package-lock.json`
- Inspect: `package-lock.json`
- Potentially modify: `next.config.ts` or equivalent
- Potentially test: existing build command

**Steps:**
1. Locate Next config.
2. Confirm whether `outputFileTracingRoot` can be set safely to the repo root.
3. If safe, add the minimal config using Node `path` import where needed.
4. Run `npm run build`.
5. If build warning disappears and build passes, keep change.
6. If uncertain or build breaks, revert and document the blocker.

**Verification:**
- `npm run build` passes.
- Warning is resolved or explicitly documented with reason.

#### Task A2: Add a repeatable E2E-with-server helper if missing
**Objective:** Prevent future false E2E failures when dev server is not running.

**Files:**
- Modify: `package.json`
- Potentially create: `scripts/e2e-with-server.sh`

**Steps:**
1. Inspect existing `tests/e2e/run-all.sh`.
2. If there is no helper that starts/stops the dev server, create a small script that starts `npm run dev`, waits for `/connect`, runs `npm run test:e2e`, then stops the server.
3. Add an npm script such as `test:e2e:dev`.
4. Run the new script.

**Verification:**
- New script exits 0.
- Existing `npm run test:e2e` remains unchanged and still works when server is running.

### Lane B — Validation and URL/path hardening

#### Task B1: Audit absolute `/api` and `/connect` path usage
**Objective:** Prevent basePath regressions.

**Files:**
- Search in `src/**/*.ts`, `src/**/*.tsx`, `tests/**/*.sh`, `tests/**/*.ts`
- Potentially modify: `src/lib/paths.ts` and callers
- Test: `src/lib/__tests__/paths.test.ts`

**Steps:**
1. Search for hard-coded `/api`, `/connect`, `/login`, `/signup`, `/editor` strings.
2. Identify unsafe client-side fetches or redirects that should use path helpers.
3. Add tests before changing helpers.
4. Patch only obvious duplicated/path-helper cases.
5. Run path tests and full unit tests.

**Verification:**
- `npm run test:run` passes.
- Existing E2E remains passable.

#### Task B2: Add validation tests for public slug/profile behavior
**Objective:** Improve confidence in public profile and slug rules.

**Files:**
- Inspect: slug/profile API routes and helper libs
- Modify tests under `src/lib/__tests__/` or route-adjacent tests if established

**Steps:**
1. Locate slug normalization/checking logic.
2. Add tests for invalid, reserved, upper-case, whitespace, and unicode-ish cases if helper exists.
3. If logic is duplicated in routes, extract a small helper only if low risk.
4. Run targeted tests then full tests.

**Verification:**
- New tests fail before helper change where applicable, then pass.
- Full `npm run test:run` passes.

### Lane C — Accessibility and UX polish

#### Task C1: Accessibility audit for dashboard/editor controls
**Objective:** Improve labels and ARIA for buttons/switches/forms without altering layout.

**Files:**
- Inspect/modify editor page/components under `src/app/(dashboard)/editor` and related `src/components`
- Tests if components have testing setup

**Steps:**
1. Inspect controls listed in E2E snapshots: share button, panel toggle buttons, add link/header/divider, drag handles, delete buttons, schedule buttons, switches.
2. Add or improve `aria-label`, `aria-describedby`, or visible text where clearly missing.
3. Avoid changing component semantics broadly unless lint/build verified.
4. Run lint/build and E2E if UI changes are made.

**Verification:**
- `npm run lint` passes.
- `npm run build` passes.
- `npm run test:e2e` passes with dev server.

#### Task C2: Safe semantic heading improvements
**Objective:** Improve heading semantics carefully, avoiding the prior invalid JSX mistake.

**Files:**
- Inspect: `src/components/ui/card.tsx`
- Modify only if simple and safe

**Steps:**
1. Decide whether changing `CardTitle` from `div` to `h3` is globally safe.
2. If safe, update TypeScript props from `React.ComponentProps<"div">` to `React.ComponentProps<"h3">` and render `<h3 ... />` with real newlines, not escaped text.
3. Run lint/build.
4. If any type/visual risk appears, revert and document instead.

**Verification:**
- `npm run lint` passes.
- `npm run build` passes.

### Lane D — Deploy readiness documentation

#### Task D1: Verify and improve `.env.example`
**Objective:** Ensure production setup is reproducible without exposing secrets.

**Files:**
- Inspect/modify: `.env.example`
- Inspect: README or docs files

**Steps:**
1. Compare env variables used in source/config against `.env.example`.
2. Add missing variable names with placeholder values only.
3. Add comments for required vs optional if style allows.
4. Do not include real secret values.

**Verification:**
- No secret values appear.
- Build still passes.

#### Task D2: Add launch/deploy checklist
**Objective:** Give Aldo a concrete checklist for Vercel/Netlify/Render/manual deployment.

**Files:**
- Create or modify: `docs/deploy-checklist.md` or README section

**Steps:**
1. Include prerequisites: environment variables, database, OAuth, basePath, domain, HTTPS, E2E smoke checks.
2. Include commands: lint, unit, build, E2E with dev server.
3. Explicitly note no external deploy is done by the agent.

**Verification:**
- Markdown is clear and does not include secrets.

### Lane E — Tests and regression coverage

#### Task E1: Strengthen share/profile SEO tests
**Objective:** Add tests around metadata and sharing fallbacks.

**Files:**
- Modify: `src/lib/__tests__/public-profile-seo.test.ts`
- Inspect: corresponding SEO helper files

**Steps:**
1. Identify current tested cases.
2. Add edge cases for missing avatar, missing bio, long display names, and fallback title/description if helpers support it.
3. Implement minimal helper fixes only if tests reveal real gaps.

**Verification:**
- Targeted test passes.
- Full unit suite passes.

#### Task E2: Document E2E artifacts and cleanup policy
**Objective:** Make screenshots/log artifacts understandable.

**Files:**
- Modify: `tests/e2e/README.md` or create if missing

**Steps:**
1. Explain how to run E2E.
2. Explain screenshots directory.
3. Explain basePath `/connect` expectation.
4. Mention dev server prerequisite or new helper script.

**Verification:**
- Documentation accurately matches scripts.

## Six-hour operating loop

Repeat for up to six hours:
1. Pick the next highest-value bite-sized task.
2. Inspect relevant files.
3. Write or update tests first when practical.
4. Make minimal implementation.
5. Run targeted validation.
6. If green, run broader validation appropriate for the touched area.
7. Commit locally if the task group is coherent and green.
8. Append progress to the report.
9. Continue to the next task.

## Stop criteria before six hours

Stop early only if:
- local model/Hermes cannot continue;
- repository is not recoverably clean;
- a product/security/deploy decision is required;
- repeated validation failures require human choice;
- disk/environment failure prevents safe work.

Do not stop early just because one task is complete. Move to the next lane.

## Final validation before ending

At the end, run:

```bash
git status --short --branch
npm run lint
npm run test:run
npm run build
# plus E2E with dev server if UI/path changes occurred, preferably always if time permits
```

## Final report requirements

Write a report in Portuguese with:
- elapsed time and cycle count;
- tasks attempted/completed;
- files changed;
- local commit SHAs, if any;
- validation commands and results;
- remaining warnings/blockers;
- no-push/no-deploy confirmation;
- next recommended steps.
