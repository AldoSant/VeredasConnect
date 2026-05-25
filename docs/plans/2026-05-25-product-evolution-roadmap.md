# Veredas Connect Product Evolution Roadmap

> **For Hermes:** Use `subagent-driven-development` skill to implement execution plans derived from this roadmap task-by-task.

**Goal:** Transform Veredas Connect from a Linktree-style link-in-bio builder into a premium digital identity, lead capture, analytics, and NFC relationship platform for professionals, creators, teams, and companies.

**Architecture:** Keep the current Next.js 15 App Router + Drizzle stack. Prioritize small vertical slices: database schema, API route, dashboard UI, public profile rendering, tests, then polish. The existing code already has strong foundations: auth, profiles, links, analytics, leads, testimonials, organizations, teams, and NFC cards.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Drizzle ORM, SQLite/local + production database target, NextAuth, Vitest, Biome.

---

## Product Positioning

Veredas Connect should not compete as “just another Linktree clone”. The stronger angle is:

> **A premium digital identity and relationship engine: one public page, one NFC card, one CRM-lite dashboard, and measurable conversion.**

### Primary user segments

1. **Independent professionals** — consultants, lawyers, doctors, designers, sales reps, creators.
2. **Small businesses** — agencies, clinics, studios, restaurants, service providers.
3. **Teams and organizations** — companies that need many employee profiles, analytics, leads, and controlled branding.
4. **Offline-to-online sellers** — people using QR/NFC cards at events, stores, fairs, and client meetings.

### Core product promise

- Create a beautiful public profile quickly.
- Convert visitors into leads, WhatsApp conversations, booked calls, saved contacts, sales, or newsletter signups.
- Track which links, people, profiles, and offline touchpoints generate results.
- Manage multiple profiles and team pages under one brand.

---

## Current Foundation Observed

Existing app capabilities:

- Auth with email/password and Google button UI.
- Public profile route at `src/app/[slug]/page.tsx`.
- Editor at `src/app/(dashboard)/editor/page.tsx`.
- Profile fields: display name, bio, avatar, job title, company, phone, WhatsApp, lead form config, webhook URL.
- Link item types: link, header, divider.
- Link scheduling fields: active, start date, end date.
- Analytics tracking through `/api/click/[id]`.
- Analytics dashboard with clicks, trends, devices, browsers.
- Leads table and leads pages/API.
- Testimonials/social proof table and dashboard page.
- Organizations, teams, roles, and RBAC foundation.
- NFC cards table and routes.
- vCard endpoint.
- Premium visual positioning already appears on the landing page.

Main opportunity: consolidate these pieces into a coherent premium product, finish rough edges, and add high-conversion features.

---

## Guiding Principles

1. **Conversion over decoration:** every feature should help capture, qualify, route, or measure attention.
2. **Professional credibility:** profiles should feel premium, trustworthy, fast, and shareable.
3. **Offline + online bridge:** QR/NFC/vCard should become a differentiator.
4. **Team-ready from day one:** organizations, teams, supervisors, and analytics should become product pillars.
5. **Small vertical releases:** avoid huge rewrites. Ship useful increments.
6. **Portuguese-first UX:** labels, empty states, onboarding, and landing copy should be polished in Portuguese.
7. **No enterprise bloat before traction:** add CRM-lite workflows, not a full CRM.

---

## Phase 0 — Stabilize and Professionalize the Base

**Objective:** Make the current app feel reliable, coherent, and ready for real users.

### Feature 0.1: Product language and navigation cleanup

**Why:** Current UI mixes English and Portuguese. This weakens trust.

**Scope:**
- Convert dashboard labels and messages to Portuguese.
- Standardize brand name: “Veredas Connect”.
- Replace generic wording like “Sign out”, “Performance Analytics”, “Active Links” with Portuguese equivalents.
- Add clear empty states for editor, analytics, leads, testimonials, cards.

**Files likely touched:**
- `src/app/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/app/(dashboard)/analytics/page.tsx`
- `src/app/(dashboard)/leads/page.tsx`
- `src/app/(dashboard)/testimonials/page.tsx`
- `src/app/(dashboard)/cards/page.tsx`
- `src/components/editor/*`

**Acceptance criteria:**
- Dashboard reads naturally in Portuguese.
- Empty accounts see helpful next actions.
- `npm run lint`, `npm run test:run`, and `npm run build` pass.

### Feature 0.2: First-run onboarding checklist

**Why:** Users need guidance to complete a useful profile.

**Scope:**
- Add dashboard checklist card:
  - Add profile photo.
  - Add display name and bio.
  - Add at least 3 links.
  - Enable WhatsApp/contact.
  - Test public page.
  - Share QR/NFC.
- Show progress percentage.
- Hide/minimize once completed.

**Files likely touched:**
- Create `src/components/dashboard/onboarding-checklist.tsx`.
- Modify `src/app/(dashboard)/editor/page.tsx`.
- Possibly add helper in `src/lib/profile-completion.ts`.

**Acceptance criteria:**
- New users know exactly what to do next.
- Completion logic is deterministic and unit-tested.

### Feature 0.3: Public profile reliability and SEO polish

**Why:** The public page is the actual product surface.

**Scope:**
- Better Open Graph metadata.
- Add Twitter card metadata.
- Add canonical URL support through `NEXT_PUBLIC_APP_URL`.
- Add structured data JSON-LD for Person/Organization.
- Add `robots`/indexing behavior for public profiles.
- Add graceful image fallback.

**Files likely touched:**
- `src/app/[slug]/page.tsx`
- `src/app/layout.tsx`
- `src/lib/seo.ts`

**Acceptance criteria:**
- Shared links look good on WhatsApp, LinkedIn, X, and Telegram.
- Missing avatar does not break metadata.

---

## Phase 1 — Make the Link Builder Best-in-Class

**Objective:** Turn the basic link editor into a flexible conversion page builder while keeping it simple.

### Feature 1.1: Rich link blocks

**Add block types:**
- Link button.
- Header.
- Divider.
- WhatsApp CTA.
- Email CTA.
- Phone CTA.
- vCard save contact.
- Embedded video link preview.
- Featured link/card.
- Lead form block.
- Testimonial block.

**Why:** A premium public page needs more than identical buttons.

**Schema idea:**
- Evolve `link_items.type` into a broader block type.
- Add `metadata` JSON text column for type-specific settings.

**Files likely touched:**
- `src/lib/db/schema.ts`
- `src/types/index.ts`
- `src/components/editor/link-item.tsx`
- `src/components/editor/add-link-button.tsx`
- `src/components/themes/premium-theme.tsx`
- `src/components/preview/preview-panel.tsx`
- API routes under `src/app/api/links/*`

**Acceptance criteria:**
- Existing links keep working.
- New block types render in editor, preview, and public page.
- Unit tests cover metadata parsing/fallbacks.

### Feature 1.2: Link thumbnails and icons

**Scope:**
- Allow icon selection per link: default, website favicon, WhatsApp, Instagram, LinkedIn, YouTube, calendar, file, custom emoji.
- Optional image thumbnail for featured links.
- Auto-detect favicon from URL as a later enhancement.

**Why:** Increases scanability and perceived quality.

### Feature 1.3: Smart link scheduling and visibility

**Current foundation:** `isActive`, `startDate`, `endDate` already exist.

**Improve:**
- UI for scheduling.
- Badge: “Agendado”, “Expirado”, “Oculto”.
- Optional timezone handling.
- Dashboard filter by active/hidden/scheduled.

**Why:** Useful for launches, events, seasonal offers.

### Feature 1.4: Link health checker

**Scope:**
- Background/manual check for broken URLs.
- Show warning in editor.
- Prevent invalid/missing protocols.
- Optional UTM builder.

**Why:** Professional users need confidence that links work.

---

## Phase 2 — Themes, Branding, and Premium Identity

**Objective:** Make profiles visually differentiated without creating an overly complex design tool.

### Feature 2.1: Theme gallery

**Themes to add:**
- Minimal professional.
- Premium dark, current direction.
- Clean light.
- Creator colorful.
- Executive corporate.
- Event/speaker.
- Restaurant/local business.

**Scope:**
- Theme selector in editor.
- Theme preview cards.
- Theme registry file instead of hardcoded rendering.

**Files likely touched:**
- `src/components/themes/*`
- `src/components/editor/profile-form.tsx`
- `src/components/preview/preview-panel.tsx`
- `src/app/[slug]/page.tsx`
- `src/lib/themes.ts`

**Acceptance criteria:**
- User can switch theme and see live preview.
- Public page uses selected theme.

### Feature 2.2: Brand kit

**Scope:**
- Accent color.
- Background style.
- Button style.
- Font preset.
- Logo/banner image.
- Organization-level default branding for teams.

**Why:** Teams and businesses need consistency.

**Schema idea:**
- Add `brandColor`, `backgroundStyle`, `buttonStyle`, `fontPreset`, `bannerUrl` to profiles, or store in profile `settings` JSON.
- For organizations, add branding defaults.

### Feature 2.3: Custom domain readiness

**Scope:**
- Add settings model and UI for custom domains.
- Prepare verification state: pending/verified/failed.
- Document DNS CNAME setup.
- Actual hosting/platform domain wiring can come later.

**Why:** High-value paid feature.

---

## Phase 3 — Conversion Engine: Leads, Forms, WhatsApp, Webhooks

**Objective:** Make Veredas Connect useful for capturing and routing business opportunities.

### Feature 3.1: Lead form builder lite

**Current foundation:** `leadFormActive`, `leadFormTitle`, `leads`, and `webhookUrl` exist.

**Improve:**
- Choose fields: name, email, phone, company, message.
- Required/optional toggles.
- Consent checkbox text.
- Success message.
- Redirect after submit.
- Spam protection/rate limit.

**Files likely touched:**
- `src/lib/db/schema.ts`
- `src/components/themes/lead-form-card.tsx`
- `src/app/api/leads/route.ts`
- `src/components/editor/profile-form.tsx`
- `src/lib/validations.ts`

### Feature 3.2: Lead inbox CRM-lite

**Scope:**
- Lead status pipeline: Novo, Contatado, Qualificado, Convertido, Perdido.
- Notes and tags UI.
- Search/filter/export.
- Quick actions: WhatsApp, email, mark contacted.
- Lead detail drawer.

**Why:** This turns a link page into a business tool.

**Files likely touched:**
- `src/app/(dashboard)/leads/page.tsx`
- `src/app/api/leads/*`
- `src/lib/db/schema.ts`

### Feature 3.3: Webhook delivery log

**Current foundation:** `webhookUrl` exists.

**Improve:**
- Send lead submissions to webhook.
- Store delivery attempts/status.
- Retry failed deliveries manually.
- Show last webhook status in dashboard.

**Why:** Lets users connect Zapier/Make/n8n/CRM without native integrations.

### Feature 3.4: WhatsApp conversion toolkit

**Scope:**
- One-click WhatsApp CTA block.
- Pre-filled message templates.
- Track WhatsApp clicks separately.
- Optional campaign/source parameter in message.

**Why:** Especially strong for Brazilian users and small businesses.

---

## Phase 4 — Analytics That Drive Decisions

**Objective:** Move from vanity click counts to actionable conversion analytics.

### Feature 4.1: Analytics v2

**Current foundation:** clicks, daily trend, device, browser.

**Add:**
- Public profile visits, not only link clicks.
- Click-through rate by profile.
- Top referrers.
- Country/city approximation if available from hosting headers, otherwise defer.
- Time range filters: 7d, 30d, 90d, all.
- Export CSV.
- Per-profile selector for multi-profile users.

**Schema idea:**
- Add `profile_views` table.
- Extend click events with profileId denormalized for faster analytics.

**Files likely touched:**
- `src/lib/db/schema.ts`
- `src/app/[slug]/page.tsx` or lightweight tracking route.
- `src/app/api/analytics/route.ts`
- `src/app/(dashboard)/analytics/page.tsx`

### Feature 4.2: Conversion funnel

**Metrics:**
- Views.
- Link clicks.
- Leads submitted.
- vCards downloaded.
- WhatsApp clicks.
- NFC scans.

**Why:** Helps user understand what actually works.

### Feature 4.3: UTM and campaign attribution

**Scope:**
- Add UTM builder per link.
- Preserve incoming UTM/source on profile views and leads.
- Campaign dashboard.

**Why:** Useful for paid traffic, events, QR codes, partnerships.

---

## Phase 5 — NFC, QR, vCard, and Offline Growth

**Objective:** Make offline sharing a signature feature.

### Feature 5.1: QR code center

**Scope:**
- Generate QR for each profile.
- Download PNG/SVG.
- Printable card/poster templates.
- QR variants with campaign tracking: event, store, card, flyer.

**Files likely touched:**
- `src/components/editor/share-dialog.tsx`
- `src/app/(dashboard)/cards/page.tsx`
- New `src/app/(dashboard)/qr/page.tsx` or inside share dialog.

### Feature 5.2: NFC card lifecycle

**Current foundation:** `nfc_cards` table and `/n/[cardId]` route exist.

**Improve:**
- Card activation flow.
- Assign card to profile.
- Label physical cards.
- Track scans per card.
- Lost/deactivate card.
- Reassign card.

**Why:** Differentiates Veredas Connect from basic link pages.

### Feature 5.3: vCard polish

**Scope:**
- Better vCard fields: organization, title, phone, WhatsApp, email, website, avatar if possible.
- “Salvar contato” block in public page.
- Track vCard downloads.

---

## Phase 6 — Multi-profile, Teams, and Organizations

**Objective:** Turn existing RBAC/schema foundation into a real B2B product.

### Feature 6.1: Profile library v2

**Current foundation:** `/profiles` exists.

**Improve:**
- Create multiple profiles.
- Duplicate profile.
- Archive profile.
- Select active/default profile.
- Search and sort by created, updated, views, leads.

### Feature 6.2: Team management v2

**Current foundation:** organizations, teams, roles.

**Improve:**
- Invite members by email.
- Assign role: Admin, Supervisor, Member.
- Assign member to team.
- Supervisor can view/manage team profiles/leads.
- Organization admin can define brand kit defaults.

### Feature 6.3: Organization analytics

**Scope:**
- Aggregate profile performance across team/company.
- Leaderboard by profile: views, clicks, leads, conversion rate.
- Export reports.

**Why:** Strong B2B value for sales teams, franchises, agencies.

---

## Phase 7 — Monetization and Product Packaging

**Objective:** Prepare the app for sustainable revenue.

### Suggested tiers

**Free:**
- 1 profile.
- Basic links.
- Basic theme.
- Limited analytics.
- Veredas branding.

**Pro:**
- Multiple profiles.
- Premium themes.
- Lead forms.
- Full analytics.
- QR downloads.
- vCard.
- No Veredas branding.

**Business:**
- Teams/organizations.
- Brand kit.
- Organization analytics.
- Webhooks.
- NFC card management.
- Custom domain.

**Enterprise/Agency:**
- Multi-client management.
- White-label options.
- Priority support.
- Advanced integrations.

### Feature 7.1: Entitlements layer before payments

**Why:** Implement feature gates before choosing Stripe/Mercado Pago/etc.

**Scope:**
- Add plan field to user/org.
- Add server-side entitlement helper.
- Gate UI gently with upgrade prompts.
- No actual billing yet.

---

## Phase 8 — Integrations and Automation

**Objective:** Make Veredas Connect fit into users’ business workflows.

### Priority integrations

1. **Webhook generic** — highest leverage and simplest.
2. **Google Sheets export/sync** — very useful for Brazilian SMBs.
3. **Zapier/Make/n8n guides** — low-code integration story.
4. **Mailchimp/Brevo/HubSpot/Pipedrive** — later.
5. **Calendar booking blocks** — Calendly, Google Calendar appointment link.
6. **Pixel tracking** — Meta Pixel, Google Analytics, TikTok Pixel, LinkedIn Insight Tag.

### Feature 8.1: Tracking pixels

**Scope:**
- Allow safe insertion of common pixel IDs, not arbitrary scripts initially.
- Server-side validation.
- Public page injects configured pixel snippets.

**Why:** Paid users care about remarketing and campaign measurement.

---

## Phase 9 — AI-Assisted Profile Builder

**Objective:** Use AI where it improves activation and quality.

### Feature 9.1: AI onboarding assistant

**Scope:**
- User enters profession/company/objective.
- Generate bio, CTA labels, first 5 links, lead form title, WhatsApp message.
- User reviews before applying.

**Why:** Reduces blank-page friction.

### Feature 9.2: Bio and CTA optimizer

**Scope:**
- Suggest stronger bio.
- Suggest CTA wording.
- Suggest profile completeness improvements.

**Rule:** Keep AI optional and review-based. Do not auto-change user content.

---

## Recommended Execution Order

### Sprint 1 — Polish and Activation

1. Portuguese UX cleanup.
2. First-run onboarding checklist.
3. Public page SEO/Open Graph polish.
4. Share dialog improvements: copy link, QR download, vCard CTA.

**Outcome:** Product feels coherent and shareable.

### Sprint 2 — Builder Upgrade

1. Theme registry and theme selector.
2. Rich blocks foundation with metadata JSON.
3. WhatsApp, email, phone, vCard blocks.
4. Link scheduling UI.

**Outcome:** Public profiles become meaningfully better than basic Linktree pages.

### Sprint 3 — Lead Engine

1. Lead form builder lite.
2. Lead inbox CRM-lite.
3. Webhook delivery.
4. WhatsApp conversion tracking.

**Outcome:** Product creates business value, not just a nice page.

### Sprint 4 — Analytics v2

1. Profile views tracking.
2. Funnel metrics.
3. Time filters and export.
4. Referrer/campaign tracking.

**Outcome:** Users can measure ROI.

### Sprint 5 — NFC/QR Differentiator

1. QR center.
2. NFC activation and scan tracking.
3. Per-card campaign analytics.
4. Printable/shareable assets.

**Outcome:** Strong unique positioning: digital identity + physical networking.

### Sprint 6 — Teams/B2B

1. Profile library v2.
2. Organization brand kit.
3. Team member invitation/assignment.
4. Organization analytics.

**Outcome:** Product can sell to teams and companies.

---

## North Star Metrics

### Activation
- % of users who publish a profile with photo, bio, and 3+ links.
- Time to first published profile.
- % who copy/share profile link or QR.

### Engagement
- Public profile views per active profile.
- Click-through rate.
- WhatsApp click rate.
- vCard download rate.

### Conversion
- Leads captured per profile.
- Lead conversion status progression.
- Webhook success rate.

### B2B
- Profiles per organization.
- Active team members.
- Leads/views per team.
- NFC scans per card.

---

## Technical Debt and Risk List

1. **Database mismatch risk:** README mentions Neon Postgres but schema uses `sqliteTable`. Decide production DB target and migration path.
2. **Analytics performance:** click events can grow quickly. Add indexes and consider denormalized `profileId`.
3. **RBAC consistency:** every org/team API must enforce access consistently through shared helpers.
4. **Public route performance:** public profiles should be fast, cacheable where safe, and not blocked by heavy analytics writes.
5. **Webhook security:** validate URLs, avoid SSRF, set timeouts, log failures safely.
6. **Custom scripts/pixels:** start with safe known providers, not arbitrary HTML/script injection.
7. **Theme sprawl:** use a theme registry and shared components to avoid duplicated rendering logic.
8. **Mobile dashboard:** link-in-bio users often operate on phones; editor must be excellent on mobile.

---

## My Strong Recommendation

The best strategic path is **not** to build every Linktree feature. Build around this wedge:

> **Premium digital identity for professionals and teams, with lead capture, WhatsApp conversion, NFC/QR sharing, and analytics.**

This is more defensible than “many links on a page” and matches the foundations already in the codebase.

The first implementation plan should be **Sprint 1: Polish and Activation**, because it makes the current product credible before adding more complexity. After that, build **Sprint 2 rich blocks + themes** and **Sprint 3 lead engine**.

---

## Immediate Next Plan to Write

Create a detailed implementation plan for:

`Sprint 1 — Portuguese UX, onboarding checklist, SEO metadata, and share/QR polish`

That plan should include exact tasks, tests, and commits for:

1. UI copy audit and Portuguese labels.
2. Profile completion helper with unit tests.
3. Onboarding checklist component.
4. Public profile SEO helper with unit tests.
5. Share dialog QR download/copy improvements.
6. Final QA: `npm run lint`, `npm run test:run`, `npm run build`.
