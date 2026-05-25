# Veredas Connect Overnight AI Implementation Orchestration Plan

> **For Hermes:** This is the operational plan for autonomous overnight implementation. Use `continuous-handoff-execution`, `subagent-driven-development`, `systematic-debugging`, and `local-model-delegation`.

**Goal:** Let the local/self-hosted AI implementation lane evolve Veredas Connect through Sprint 1 while the human is away, with safe guardrails, local commits, validation gates, and a final report.

**Primary repo:** `/home/annaa/dev/VeredasConnect`

**Source roadmap:** `docs/plans/2026-05-25-product-evolution-roadmap.md`

**Durable handoff files:**
- Execution plan: `/home/annaa/dev/handoffs/incoming/veredasconnect-overnight-sprint1-plan.md`
- Background prompt: `/home/annaa/dev/handoffs/incoming/veredasconnect-overnight-sprint1-prompt.txt`
- Supervisor script: `/home/annaa/dev/handoffs/incoming/veredasconnect-overnight-sprint1-supervisor.sh`
- Final report: `/home/annaa/dev/handoffs/results/veredasconnect-overnight-sprint1-report.md`
- Supervisor log: `/home/annaa/dev/handoffs/results/veredasconnect-overnight-sprint1-supervisor.log`

---

## Operating Model

The overnight run is divided into bounded cycles. Each cycle should:

1. Read current repo state and latest report.
2. Pick the next incomplete safe task.
3. Implement a small vertical slice.
4. Run targeted validation.
5. Commit locally if validation passes.
6. Update the report with exact commands, results, changed files, and next task.
7. Stop only when a stop marker is appropriate or maximum cycles are reached.

The supervisor script can relaunch Hermes for several cycles so work continues even if one cycle finishes naturally.

---

## Local AI Delegation Strategy

Hermes default profile already has delegation configured for LM Studio/OpenAI-compatible endpoint:

- Provider: `custom:lmstudio`
- Base URL: `http://54.232.189.113:1234/v1`
- API key: `no-key-required`
- Model: `google/gemma-4-e4b`

Use paid GPT-level orchestration only for:

- Selecting the next task.
- Resolving architecture tradeoffs.
- Final review.
- Safety-sensitive decisions.

Use local AI/delegation for:

- Bulk code edits.
- UI copy conversion.
- Component implementation.
- Test writing.
- Repetitive refactors.
- Report drafting.

If local delegation is unavailable, the background runner should:

- Try a direct small test once.
- Fall back to local implementation in the same runner if it is already local.
- Otherwise stop with `AGUARDANDO_USUARIO` instead of burning paid tokens indefinitely.

---

## Non-negotiable Safety Rules

Allowed unattended:

- Read files.
- Create/edit source files and docs inside `/home/annaa/dev/VeredasConnect`.
- Install dependencies only if absolutely necessary and recorded.
- Run `npm run lint`, `npm run lint:fix`, `npm run test:run`, `npm run build`.
- Create local git commits.
- Write reports and logs.

Forbidden unattended:

- `git push`.
- Deployments.
- Production migrations.
- Changing production secrets.
- Printing secrets into logs/reports.
- `git reset --hard`, history rewrite, broad `rm -rf`, destructive cleanup.
- Major product/monetization decisions not already described in the roadmap.
- Replacing the stack or rewriting the app.

Stop and ask if:

- A task requires production credentials, DNS, billing provider, or deployment decision.
- Tests/build fail due to missing secrets that cannot be safely stubbed.
- Database dialect/migration strategy requires a product decision.
- A change would touch more than ~25 files outside formatter-only changes.
- Local AI/delegation is unavailable and continuing would rely on paid model for bulk coding.

---

## Target Scope for Overnight Run: Sprint 1

Sprint 1 is intentionally bounded. The goal is not to build the whole roadmap. The goal is to make the existing product feel credible, shareable, and ready for the next phase.

### Lane A — Portuguese UX cleanup

**Objective:** Remove English UX from core dashboard/public flows and make text consistent with Veredas Connect positioning.

**Likely files:**
- `src/app/(dashboard)/layout.tsx`
- `src/app/(dashboard)/analytics/page.tsx`
- `src/app/(dashboard)/leads/page.tsx`
- `src/app/(dashboard)/testimonials/page.tsx`
- `src/app/(dashboard)/cards/page.tsx`
- `src/components/editor/*`
- `src/components/auth/*`

**Implementation rules:**
- Prefer natural Brazilian Portuguese.
- Preserve component behavior.
- Do not change route paths.
- Do not translate code identifiers unless creating new helpers.

**Validation:**
- `npm run lint`
- Targeted tests if text helpers are added.

**Commit suggestion:** `chore: polish Portuguese dashboard copy`

### Lane B — Profile completion helper and onboarding checklist

**Objective:** Give new users a visible “complete seu perfil” path.

**Tasks:**
1. Create pure helper `src/lib/profile-completion.ts`.
2. Add unit tests `src/lib/__tests__/profile-completion.test.ts`.
3. Create `src/components/dashboard/onboarding-checklist.tsx`.
4. Render checklist in editor above profile/link controls.

**Checklist items:**
- Nome de exibição preenchido.
- Bio preenchida.
- Foto/avatar preenchido.
- Pelo menos 3 links ativos.
- WhatsApp ou telefone preenchido.
- Formulário de lead ativo ou CTA de contato configurado.

**Helper output:**
- `items`: array with id, label, completed.
- `completedCount`.
- `totalCount`.
- `percentage`.
- `isComplete`.

**Validation:**
- `npm run test:run -- src/lib/__tests__/profile-completion.test.ts` if supported; otherwise `npm run test:run`.
- `npm run lint`.

**Commit suggestion:** `feat: add profile completion onboarding checklist`

### Lane C — Public profile SEO and share metadata

**Objective:** Make shared public profiles look premium on social/messaging platforms.

**Tasks:**
1. Create `src/lib/seo.ts` with URL and metadata helpers.
2. Add tests `src/lib/__tests__/seo.test.ts`.
3. Update `src/app/[slug]/page.tsx` metadata:
   - canonical URL.
   - Open Graph title/description/image/url/type.
   - Twitter card.
   - robust fallback description.
4. Add JSON-LD Person/Organization block if safe and simple.

**Rules:**
- Use `NEXT_PUBLIC_APP_URL` when available.
- Avoid hardcoding localhost in production metadata.
- Do not break pages without avatar.

**Validation:**
- `npm run test:run -- src/lib/__tests__/seo.test.ts` if supported; otherwise `npm run test:run`.
- `npm run build`.

**Commit suggestion:** `feat: improve public profile SEO metadata`

### Lane D — Share dialog improvements

**Objective:** Make sharing concrete and useful: copy public URL, QR, vCard, open public page.

**Likely file:**
- `src/components/editor/share-dialog.tsx`

**Tasks:**
1. Ensure copy profile link works and has Portuguese toast.
2. Show QR code for public URL.
3. Add download QR as PNG if feasible using existing `qrcode.react`.
4. Add vCard link: `/api/vcard/[slug]`.
5. Add “abrir página pública” link.
6. Add fallback when profile has no slug.

**Validation:**
- `npm run lint`.
- `npm run build`.

**Commit suggestion:** `feat: polish profile sharing tools`

### Lane E — Final integration and report

**Objective:** Verify everything together.

**Commands:**
- `npm run lint`
- `npm run test:run`
- `npm run build`
- `git status --short --branch`
- `git log --oneline -5`

**Report must include:**
- Summary.
- Local commits created.
- Files changed.
- Validation commands and results.
- Known warnings.
- Remaining safe next tasks.
- Whether push/deploy is still pending.
- Stop marker.

---

## Validation Gates

### Pre-flight Gate

Before editing:

- `git status --short --branch`
- `npm run test:run` only if quick enough; otherwise record baseline from latest known state.
- `npm run lint` if feasible.

If repo is dirty with unknown user changes, stop and report `AGUARDANDO_USUARIO`.

### Revision Gate

After each lane:

- Run targeted tests/lint.
- Inspect `git diff --stat`.
- Commit locally only if validations pass.

### Escalation Gate

Ask user through Telegram only for blockers such as secrets, deployment, push, migrations, billing, DNS, or excessive scope.

### Abort Gate

Abort unattended cycle if:

- Same validation fails twice without clear progress.
- Build is broken by environment/secrets.
- Required decision is outside this plan.
- More than maximum allowed cycles are reached.

---

## Stop Markers

Use exactly one of these in the final report:

- `CRITERIO_DE_PARADA_ATINGIDO` — Sprint 1 safe scope completed or maximum safe work completed.
- `AGUARDANDO_USUARIO` — human decision required.

---

## Recommended Start Command

From any Hermes session, start the supervisor with:

```bash
bash /home/annaa/dev/handoffs/incoming/veredasconnect-overnight-sprint1-supervisor.sh
```

When starting via Hermes terminal tool, use `background=true` and `notify_on_complete=true`.

---

## Push Policy

The overnight runner may create local commits, but must not push.

After review, the human can authorize:

```bash
cd /home/annaa/dev/VeredasConnect
git push origin main
```
