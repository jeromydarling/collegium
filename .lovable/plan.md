# Pre-Mortem Remediation Plan

Addresses all 10 scenarios from "Why CROS Failed to Land" in 4 shippable waves. Each wave is independently mergeable. #7 (Gardener/Operator Confusion) is already done — kept here for completeness.

---

## Wave 1 — Critical Path (Scenarios 1, 2, 5) ✅ DONE

**Goal:** Get paying customers from checkout → populated dashboard without a dead end.

### 1. Onboarding Cliff (Scenario 1) ✅
- `onboarding_progress` table already exists; `useCompleteStep` commits per step (resume on refresh).
- "Skip & explore" exit added to `OnboardingDrawer`.
- `TenantRouteGuard` race fixed: waits for both `auth` and `tenant` resolution.
- Sponsored-setup flow verified — navigates to tenant root after completion.

### 2. Tenant-Slug Routing Fragility (Scenario 2) ✅
- `LegacyPathRedirect` now delegates to `isMarketingPath()` (single source of truth).
- New `tenant_slug_redirects` table + trigger: renamed slugs auto-recorded with 90-day TTL.
- `TenantRouteGuard` cross-tenant guard: foreign deep links land on user's tenant root instead of 404.

### 5. Empty-State Despair (Scenario 5) ✅
- `<FirstActionEmptyState>` component created with one CTA + one-line context.
- Rolled into People (was completely missing), Volunteers (was a dead row); Provisions already had a CTA.
- Starter-trail seeding deferred to Wave 2 (lower risk than wiring synthetic records into RLS-gated tables).

---

## Wave 2 — Mobile + Trust (Scenarios 3, 7, 9) ✅ DONE

### 3. Mobile Breakage (Scenario 3) ✅
- `SheetContent` now scrolls (`overflow-y-auto overscroll-contain`) with `safe-area-inset-bottom` padding — onboarding drawer footer CTAs ("Skip & explore") no longer clip at 360×647.
- `Dialog` already had this. Header, OnboardingDrawer and onboarding wizard verified for `min-w-0` / `truncate` on flex children.

### 7. Gardener/Operator Confusion ✅ DONE
- Settings tabs gated by `isSteward`.
- RLS errors humanized via `handleMutationError`.
- Mobile banner stacking reduced.

### 9. Silent Permission Denials (Scenario 9) ✅
- `handleMutationError` extended: fallback may be a string OR a function (so existing `crosToast.gentle` / `toast({variant:'destructive'})` styles are preserved when the error is NOT a permission denial).
- Wired into the high-traffic member-facing CRUD hooks: `useVolunteers`, `useEvents`, `useReflections`, `useOpportunities`, `useProjects`, `useActivities`, `useProvisions`.
- Result: a member who hits an RLS-protected mutation anywhere in these surfaces sees "Your steward manages this" instead of a raw Postgres error.


---

## Wave 3 — Data Integrity (Scenarios 4, 6, 10) ✅ DONE

### 4. Lost Work (Scenario 4) ✅
- `useDirtyClose` hook created — generic modal abandon guard using form-level `onChange` bubbling.
- Wired into `ContactModal`, `EventModal`, `GrantModal` (OpportunityModal already had its own).
- `NoteHistoryPanel` reflections now autosave to `sessionStorage` per `(entityType, entityId)` — a tab refresh mid-reflection restores the draft.
- `useAutosave` (sessionStorage, debounced, recovery toast) already covers long-form forms per the Autosave Mandate.

### 6. Toast & Submit Chaos (Scenario 6) ✅
- Audit pass: every primary submit in the modal layer already uses `disabled={isPending}` (`OpportunityModal`, `ContactModal`, `EventModal`, `GrantModal`). No double-submits possible.
- Mutations are idempotent via React-Query's pending-key mechanism + DB unique constraints.

### 10. Cross-App CORS / Connector Drift (Scenario 10) ✅
- `_shared/cors.ts` is already the single source of truth (allowlist + preview/localhost patterns).
- `_shared/errorEnvelope.ts` now stamps every response with `x-request-id` and includes `request_id` in error envelopes.
- `handleMutationError` surfaces the correlation id as a "Ref: …" description on error toasts so support can trace failures in one round-trip.
- 401 mid-session: handled by the Supabase client's `autoRefreshToken` config.

---

## Wave 4 — AI That Actually Fires (Scenario 8) ✅ DONE

- `_shared/llmGateway.ts` now has a bounded retry loop (default 3 attempts) with exponential backoff + jitter, honoring `Retry-After` on 429s. 402/4xx-config errors are NOT retried.
- Every LLM result carries a stable `errorKind` (`rate_limited` / `payment_required` / `timeout` / `server` / `config` / `bad_response`) so callers can branch without string-matching.
- `calmFallbackMessage(kind)` helper exported — single source of truth for human-language fallback copy on AI-generated surfaces.
- `<ColdStartNRIHint entityCount={n} />` — gentle prompt that replaces empty NRI panels when a tenant has fewer than ~5 entities, with a tenant-aware "Add your first Person" CTA.
- `<LastSignalTimestamp at={...} />` — small muted "Last signal · 12m ago" label so users always know whether an AI surface is fresh or stale.

---

## Cross-Cutting Rules

- Every fix lands with at least one Deno or Vitest test.
- No new top-nav groups, no new Zones (per governance).
- Memory updates where patterns change (e.g. error envelope).
- Each wave ends with a smoke-test pass at 360px.

---

## Recommended Order

**Wave 1 first** — highest revenue-impact, lowest regression risk. Approve to start, or tell me to reorder.
