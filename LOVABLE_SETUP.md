# LOVABLE_SETUP

This document is the single source of truth for getting Collegium running on a
fresh Supabase project via Lovable. Paste the **prompt block at the bottom of
this file** into Lovable and it will do everything in order.

## What gets created

- **Supabase project** (Lovable creates it; you connect it)
- **Auth** — email/password + Google OAuth + password reset
- **Schema** — 24 tables with RLS, indexes, triggers, and the
  `handle_new_user` hook that auto-creates a `profiles` row on signup
- **Seed data** — three starter chapters and one upcoming Red Mass event so
  the public surfaces aren't empty on first load
- **Environment variables** — `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_PUBLISHABLE_KEY` wired into the Vite build

The app's already-built auth UI lives at:

- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/auth/reset-password`
- `/auth/callback` (OAuth landing — Supabase parses the URL hash, then
  routes the user to `/app` or `/auth/reset-password` depending on the
  link type)

## Files Lovable needs

1. **`supabase/setup/collegium_schema.sql`** — consolidated migration
   (tables + RLS + triggers). ~640 lines, idempotent, safe to re-run.
2. **`supabase/setup/02_seed.sql`** — three starter chapters + one event.
3. **`src/collegium/lib/auth/CollegiumAuthContext.tsx`** — already wired
   into `CollegiumApp.tsx`. Provides `signIn`, `signUp`, `signOut`,
   `signInWithGoogle`, `resetPassword`, `updatePassword`.

## Manual steps Lovable should perform (the prompt at the bottom asks for these)

### A. Connect Supabase

Lovable has built-in Supabase project provisioning via the
**Connect Supabase** action. Either:

- Create a new project (Lovable will set the URL + publishable key as env
  vars automatically), OR
- Connect an existing project (Lovable's Supabase MCP can apply
  migrations against it).

### B. Apply the migrations

Use Lovable's Supabase MCP `apply_migration` (or paste into the SQL
editor in this order):

1. `supabase/setup/collegium_schema.sql`
2. `supabase/setup/02_seed.sql`

Re-runs are idempotent (`CREATE TABLE IF NOT EXISTS`, `ON CONFLICT DO
NOTHING`, `CREATE OR REPLACE POLICY`).

### C. Enable Google OAuth

In the Supabase dashboard under **Authentication → Providers**:

1. Toggle **Google** to enabled.
2. Lovable typically pre-fills the OAuth client ID and secret via its
   built-in Google provider — accept that. If asked to set them manually,
   create OAuth credentials at
   <https://console.cloud.google.com/apis/credentials> and paste them in.
3. Set the **Authorized redirect URL** in Google Cloud to:
   ```
   https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   ```
4. In Supabase **Authentication → URL Configuration**, set:
   - **Site URL** to your production domain (e.g. `https://collegium.app`)
   - **Redirect URLs** to include both your production domain
     (`https://collegium.app/auth/callback`) and your localhost
     (`http://localhost:5173/auth/callback`) so dev works.

### D. Email templates (optional but recommended)

In **Authentication → Email Templates**, customize:

- **Confirm signup** — set the link target to `{{ .SiteURL }}/auth/callback`
- **Reset password** — link target `{{ .SiteURL }}/auth/reset-password`
- **Magic link** — link target `{{ .SiteURL }}/auth/callback`

Default templates work; updating the link targets gives you cleaner URLs.

### E. Create the first admin user

Once you sign up via the app, run this SQL to grant yourself the `admin`
role (replace the email):

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = '[email protected]'
on conflict do nothing;

update public.profiles set is_approved = true
where user_id = (select id from auth.users where email = '[email protected]');
```

The admin role unlocks steward-only writes across the schema (creating
chapters, publishing matters, granting other roles).

## The Lovable prompt

Copy everything between the lines below and paste into Lovable:

---

> Connect Supabase to this project (create a new project if I don't have one
> linked yet). Then apply the two migration files in `supabase/setup/` in
> order: first `collegium_schema.sql`, then `02_seed.sql`. Both are
> idempotent.
>
> Once the schema is in place, enable the Google OAuth provider in the
> Supabase dashboard using your built-in Google integration. Set the Site
> URL to my project's preview URL and add both the preview URL and
> `http://localhost:5173/auth/callback` to the authorized redirect URLs.
>
> The app already has the sign-in, sign-up, forgot-password, and OAuth
> callback pages wired at `/auth/*`, and the `CollegiumAuthProvider`
> already wraps the router in `src/collegium/CollegiumApp.tsx`. You
> shouldn't need to write any auth code — just connect Supabase, apply
> the migrations, and enable Google OAuth.
>
> When you're done, give me a SQL snippet I can run to make my account
> the first admin (set my `is_approved=true` and insert an `admin` row
> into `user_roles`). Use my Lovable account email as the seed admin.

---

## Verifying the setup

After Lovable finishes, smoke-test:

1. Visit `/auth/sign-up`, create an account → email confirmation arrives.
2. Click the confirmation link → lands on `/auth/callback` → routes to `/app`.
3. Sign out, visit `/auth/sign-in` → Google button works (one-tap if
   you're signed into Google in the browser).
4. From `/auth/sign-in`, click **Forgot password?** → email arrives →
   link routes to `/auth/reset-password` → set new password → routes to `/app`.
5. In the Supabase Table Editor, confirm:
   - `auth.users` has your row
   - `public.profiles` has the matching row (auto-created by trigger)
   - `public.chapters` has 3 rows
   - `public.events` has 1 row

If all five pass, the site is up.

## What's deliberately NOT in this setup

- **Edge functions** — none are required for the auth + data layer to
  work. The `read-ai-webhook` function exists in `supabase/functions/`
  for the larger SaaS in this monorepo; if you want the same wired for
  Collegium, port it under a Collegium-specific name and add it to
  `supabase/config.toml`.
- **Storage buckets** — `matter_documents.storage_path` references a
  bucket but the bucket itself isn't created here. When you wire
  document uploads, create a private bucket named `matter-documents`
  with RLS mirroring the `matter_documents` table.
- **Stripe billing** — not wired. The pricing pages live in the app
  but they don't transact yet.
- **Email provider** — Supabase's default email-sending limits (3
  emails/hour on the free tier) will throttle once real users sign up.
  For production, configure SMTP under **Authentication → SMTP Settings**
  with a transactional provider (Resend, Postmark, SendGrid).

## Resetting

If you want to wipe everything and start over:

```sql
-- DESTRUCTIVE — drops every Collegium table.
drop schema public cascade; create schema public;
grant usage on schema public to anon, authenticated, service_role;
grant create on schema public to service_role;
```

Then re-apply `collegium_schema.sql` and `02_seed.sql`.
