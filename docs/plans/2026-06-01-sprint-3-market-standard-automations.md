# Sprint 3 — Market-Standard Automation Product Layer

> **For Hermes:** Keep this sprint vendor-neutral. Do not present Telegram, Google Sheets, Odoo, or any one tool as the product. Treat n8n as the orchestration host and define market-standard automation categories that can map to many providers.

**Goal:** Move Veredas Connect from "a site with webhooks" toward a market-standard automation product by defining generic automation recipes, neutral documentation, and public positioning around outcomes instead of specific apps.

**Architecture:** Keep the existing event envelope (`event`, `occurredAt`, `source`, domain objects) and add a typed catalog of automation recipes that describes what each market workflow does, which events trigger it, and which generic destination category it needs. Expose the catalog in landing/docs without coupling the app to provider credentials.

**Tech Stack:** Next.js 15 App Router, TypeScript, Vitest, Biome, n8n docs/workflow handoff.

---

## Market positioning

The market pattern is not "send lead to tool X". The pattern is:

1. Capture intent.
2. Qualify and enrich.
3. Route to the right owner/system.
4. Notify only when useful.
5. Follow up on a timed sequence.
6. Measure conversion and SLA.
7. Sync to the customer's system of record.

Veredas should sell this as an automation layer for relationship and conversion, with provider-neutral connectors.

## References checked

- Zapier-style lead management automation examples: useful for lifecycle stages, but too provider-specific.
- n8n workflow collections: useful for event routing and composable nodes, but product should stay neutral.
- SaaS/product landing references: Stripe/Linear/Vercel pattern — lead with outcomes and system quality, not app logos.

## Task 1: Add automation recipe catalog

**Objective:** Define generic market-standard automation recipes as typed data.

**Files:**
- Create: `src/lib/automation-recipes.ts`
- Create: `src/lib/__tests__/automation-recipes.test.ts`

**Recipes:**
- Lead intake and qualification
- Smart owner routing
- Timed follow-up sequence
- Contact enrichment
- Pipeline sync
- Engagement scoring
- Weekly performance digest

**Acceptance:** tests prove recipe IDs are unique, no vendor names leak into destination labels, and all recipes map to supported Veredas events.

## Task 2: Update public positioning

**Objective:** Replace provider-specific examples in public copy with generic outcome categories.

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/lib/pricing.ts`

**Acceptance:** landing says platform supports automation categories like CRM sync, notification, email sequence, scheduling, database/warehouse, enrichment, analytics — without naming specific third-party products.

## Task 3: Update n8n docs

**Objective:** Make the n8n handoff show a neutral router and implementation pattern.

**Files:**
- Modify: `docs/n8n/README.md`
- Create: `docs/n8n/market-standard-router.md`

**Acceptance:** docs explain how to route by event and attach any provider/tool later.

## Task 4: Verification

Run:

```bash
npm run lint:fix
npm run lint
npm run test:run
npm run build
git diff --check
```

## Task 5: Commit

```bash
git add -A
git commit -m "feat: add vendor-neutral automation catalog"
```
