-- ============================================================================
-- 20260608210000_stripe_connect_webhook_columns.sql
--
-- Adds the columns the stripe-connect-webhook function writes when a Stripe
-- payout to a connected account fails; drops two unused legacy columns:
--   * federation_apps.connect_revenue_share_pct — never read or written;
--     splits are stored per-tenant on tenant_stripe_connect.platform_fee_percent.
--   * tenants.stripe_connect_account_id — superseded by the
--     tenant_stripe_connect table (one row per tenant with full account state);
--     no code path references the column on tenants.
-- ============================================================================

-- 1. Payout-failure columns on tenant_stripe_connect ------------------------
ALTER TABLE public.tenant_stripe_connect
  ADD COLUMN IF NOT EXISTS last_payout_failure_code    text,
  ADD COLUMN IF NOT EXISTS last_payout_failure_message text,
  ADD COLUMN IF NOT EXISTS last_payout_failure_at      timestamptz;

COMMENT ON COLUMN public.tenant_stripe_connect.last_payout_failure_code IS
  'Stripe failure_code from the most recent payout.failed webhook event.';
COMMENT ON COLUMN public.tenant_stripe_connect.last_payout_failure_message IS
  'Human-readable failure_message from the most recent payout.failed event.';
COMMENT ON COLUMN public.tenant_stripe_connect.last_payout_failure_at IS
  'When the most recent payout.failed event was received. Null = no failures.';

-- 2. Drop unused federation_apps.connect_revenue_share_pct -----------------
ALTER TABLE public.federation_apps
  DROP COLUMN IF EXISTS connect_revenue_share_pct;

-- 3. Drop unused tenants.stripe_connect_account_id -------------------------
-- Superseded by tenant_stripe_connect.stripe_account_id. The index goes too.
DROP INDEX IF EXISTS public.idx_tenants_stripe_connect;
ALTER TABLE public.tenants
  DROP COLUMN IF EXISTS stripe_connect_account_id;
