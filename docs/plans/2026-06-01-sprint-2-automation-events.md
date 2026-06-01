# Sprint 2 — Automation Events and Webhook Test Implementation Plan

> **For Hermes:** Use subagent-driven-development skill for read-only reviews. Keep overlapping edits centralized. Use TDD for pure helpers and route behavior.

**Goal:** Make Veredas Connect easier to connect to n8n by adding event schemas beyond `lead.created`, a safe test-webhook endpoint, and richer importable n8n documentation/templates.

**Architecture:** Keep event builders in `src/lib/automation-events.ts` and delivery in `src/lib/webhook-dispatcher.ts`. Add one authenticated endpoint that sends a synthetic event to the current profile webhook so the user can validate n8n before real traffic. Avoid storing secrets or adding production-only dependencies.

**Tech Stack:** Next.js 15 App Router, TypeScript, Drizzle, Vitest, Biome, n8n JSON workflow docs.

---

## Task 1: Extend automation event contract

**Objective:** Add stable event payload builders for `webhook.test`, `link.clicked`, and `vcard.downloaded` without wiring all routes yet.

**Files:**
- Modify: `src/lib/automation-events.ts`
- Modify: `src/lib/__tests__/automation-events.test.ts`

**Steps:**
1. Add failing tests for the three event builders.
2. Run targeted Vitest and verify failure.
3. Implement builders with explicit `event`, `occurredAt`, `source`, and normalized optional fields.
4. Run targeted tests and full unit suite.

## Task 2: Add authenticated webhook test endpoint

**Objective:** Create `POST /api/webhook/test` so dashboard users can send a synthetic event to n8n before publishing.

**Files:**
- Create: `src/app/api/webhook/test/route.ts`
- Test indirectly through helper tests and build because route uses live auth/db integration.

**Expected behavior:**
- Requires authenticated session scope.
- Reads current/allowed profile by `profileId` when provided, otherwise first accessible profile with `webhookUrl`.
- Returns `400` if no webhook is configured.
- Sends `webhook.test` payload via `dispatchWebhookEvent`.
- Returns delivery result.

## Task 3: Improve editor integration copy

**Objective:** Make webhook field easier to use with n8n and document the test endpoint behavior in UI copy.

**Files:**
- Modify: `src/components/editor/profile-form.tsx`

**Expected behavior:**
- Explain that production n8n URL should be pasted there.
- Warn not to paste credentials.
- Mention that the platform sends `lead.created` and can send test events.

## Task 4: Expand n8n artifacts

**Objective:** Make the n8n handoff more complete without requiring VPS access now.

**Files:**
- Modify: `docs/n8n/README.md`
- Create/modify: `docs/n8n/veredas-lead-created-starter.json`

**Expected behavior:**
- README documents `webhook.test`, `lead.created`, future events, and validation steps.
- Starter workflow keeps importable JSON and has clear extension points.

## Task 5: Verification and commit

**Commands:**
```bash
npm run lint:fix
npm run lint
npm run test:run
npm run build
git diff --check
git status --short
git add -A
git commit -m "feat: add webhook validation events"
```

**Acceptance criteria:**
- Tests pass.
- Build passes.
- No secrets introduced.
- n8n docs are actionable.
- Commit local only; no push/deploy.
