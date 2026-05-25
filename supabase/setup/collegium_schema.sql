-- ============================================================================
--  COLLEGIUM — CONSOLIDATED SCHEMA
--  ----------------------------------------------------------------------------
--  A single migration that bootstraps every Collegium-specific table on a
--  fresh Supabase project. Designed to be applied once, in order, with no
--  external dependencies beyond the platform's `auth.users` table.
--
--  Apply via either:
--      • Lovable's "Connect Supabase" → "Run migrations" prompt, OR
--      • supabase CLI:  supabase db reset --linked && supabase db push, OR
--      • Paste the whole file into the Supabase SQL Editor and press Run.
--
--  Idempotent: every CREATE uses IF NOT EXISTS and every policy is
--  CREATE OR REPLACE. Re-running is safe.
--
--  Lineage: this file ships independently from the 449-migration
--  history in supabase/migrations/ — those belong to a different SaaS
--  in the same monorepo. Do not mix the two on the same project.
-- ============================================================================

-- ── 0. Extensions ──────────────────────────────────────────────────────────
create extension if not exists pgcrypto;     -- gen_random_uuid()
create extension if not exists pg_trgm;      -- fuzzy matching on names
create extension if not exists "uuid-ossp";  -- legacy compat

-- ── 1. Enums ──────────────────────────────────────────────────────────────
do $$ begin
  create type collegium_role as enum ('admin', 'steward', 'member', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type vocation_stage as enum (
    'lawyer', 'young-lawyer', 'canon-lawyer', 'judge', 'professor',
    'clergy', 'retired', 'student'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type mentor_pair_cadence as enum ('weekly', 'biweekly', 'monthly');
exception when duplicate_object then null; end $$;

do $$ begin
  create type mentor_pair_status as enum ('thriving', 'steady', 'drifting', 'paused');
exception when duplicate_object then null; end $$;

do $$ begin
  create type pair_meeting_status as enum (
    'scheduled', 'completed', 'missed', 'rescheduled', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type pair_outcome_kind as enum (
    'bar-passed', 'bar-failed', 'first-job', 'judicial-clerkship',
    'internship', 'moot-court', 'publication', 'partnership-track',
    'partnership-offered', 'still-in-practice-1yr',
    'still-in-practice-3yr', 'still-in-practice-5yr',
    'still-in-practice-10yr', 'left-practice', 'left-and-returned',
    'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type mentorship_request_direction as enum (
    'mentee-to-mentor', 'mentor-to-mentee'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type mentorship_request_status as enum (
    'pending', 'accepted', 'declined', 'withdrawn'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type integration_provider as enum (
    'read-ai', 'zoom', 'google-calendar', 'outlook', 'apple-calendar'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type matter_lifecycle_state as enum (
    'intake-scheduled', 'intake-complete', 'active',
    'filing-pending', 'client-response-pending', 'closed'
  );
exception when duplicate_object then null; end $$;

-- ── 2. profiles  (extends auth.users 1:1) ─────────────────────────────────
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  first_name text,
  timezone text default 'America/Chicago',
  vocation_stage vocation_stage,
  chapter_id uuid,
  bio text,
  city text,
  practice_areas text[] default '{}',
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_chapter_idx on public.profiles(chapter_id);
create index if not exists profiles_vocation_idx on public.profiles(vocation_stage);

-- ── 3. user_roles  (a user may have multiple roles) ───────────────────────
create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role collegium_role not null,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id),
  primary key (user_id, role)
);

-- ── 4. chapters ──────────────────────────────────────────────────────────
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  region text,
  latin_motto text,
  blurb text,
  founded_on date,
  latitude double precision,
  longitude double precision,
  color_token text default 'wine',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- profiles.chapter_id → chapters.id  (added after both tables exist)
do $$ begin
  alter table public.profiles
    add constraint profiles_chapter_fk
    foreign key (chapter_id) references public.chapters(id) on delete set null;
exception when duplicate_object then null; end $$;

-- ── 5. mentor_pairs + pair_meetings + pair_outcomes ───────────────────────
create table if not exists public.mentor_pairs (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.profiles(user_id) on delete cascade,
  mentee_id uuid not null references public.profiles(user_id) on delete cascade,
  started_on date not null default current_date,
  cadence mentor_pair_cadence not null default 'monthly',
  last_meeting date,
  status mentor_pair_status not null default 'steady',
  notes text,
  video_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mentor_id, mentee_id)
);
create index if not exists mentor_pairs_mentor_idx on public.mentor_pairs(mentor_id);
create index if not exists mentor_pairs_mentee_idx on public.mentor_pairs(mentee_id);

create table if not exists public.pair_meetings (
  id uuid primary key default gen_random_uuid(),
  pair_id uuid not null references public.mentor_pairs(id) on delete cascade,
  scheduled_for timestamptz not null,
  duration_minutes int not null default 60,
  agenda text,
  status pair_meeting_status not null default 'scheduled',
  notes text,
  video_link text,
  recording_url text,
  /** Read.ai / Zoom AI / Otter meeting summary — see src/collegium/lib/
      integrations/readAi.ts for the shape. */
  summary jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pair_meetings_pair_idx on public.pair_meetings(pair_id, scheduled_for);

create table if not exists public.pair_outcomes (
  id uuid primary key default gen_random_uuid(),
  pair_id uuid not null references public.mentor_pairs(id) on delete cascade,
  occurred_on date not null,
  kind pair_outcome_kind not null,
  detail text not null,
  recorded_by_user_id uuid references auth.users(id),
  recorded_by_display text,
  recorded_at timestamptz not null default now(),
  /** OutcomeVerification — see src/collegium/data/demo.ts. */
  verification jsonb
);
create index if not exists pair_outcomes_pair_idx on public.pair_outcomes(pair_id, occurred_on desc);

-- ── 6. mentorship_requests  (MentorMatch handshake) ──────────────────────
create table if not exists public.mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references public.profiles(user_id) on delete cascade,
  to_user_id uuid not null references public.profiles(user_id) on delete cascade,
  direction mentorship_request_direction not null,
  message text,
  status mentorship_request_status not null default 'pending',
  proposed_cadence mentor_pair_cadence,
  proposed_focus text,
  submitted_at timestamptz not null default now(),
  resolved_at timestamptz,
  resulting_pair_id uuid references public.mentor_pairs(id) on delete set null
);
create index if not exists mentorship_requests_to_idx
  on public.mentorship_requests(to_user_id, status);

-- ── 7. integration_connections ───────────────────────────────────────────
create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  pair_id uuid not null references public.mentor_pairs(id) on delete cascade,
  provider integration_provider not null,
  connected boolean not null default false,
  connected_at timestamptz,
  provider_account_id text,
  display_name text,
  /** Encrypted OAuth tokens — keep off the client; only edge functions
      read these. Stored as bytea after encryption with a key from
      Supabase vault. */
  token_blob bytea,
  unique (pair_id, provider)
);

-- ── 8. Per-user state (saved excerpts, enrolled tracks, etc.) ────────────
create table if not exists public.saved_excerpts (
  user_id uuid not null references auth.users(id) on delete cascade,
  excerpt_id text not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, excerpt_id)
);

create table if not exists public.enrolled_tracks (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  enrolled_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

create table if not exists public.track_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  week_number int not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, track_id, week_number)
);

-- Per-user pocketbook curation overrides (the devotional Field Guide).
create table if not exists public.devotional_pocketbook (
  user_id uuid not null references auth.users(id) on delete cascade,
  day_number int not null,
  included boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, day_number)
);

-- ── 9. mentor_journal entries (per-pair shared reflection log) ───────────
create table if not exists public.mentor_journal (
  id uuid primary key default gen_random_uuid(),
  pair_id uuid not null references public.mentor_pairs(id) on delete cascade,
  author_user_id uuid not null references auth.users(id),
  at timestamptz not null default now(),
  /** { kind: 'excerpt'|'prompt'|'note', id?: string, label?: string } */
  source jsonb not null,
  body text not null
);
create index if not exists mentor_journal_pair_idx
  on public.mentor_journal(pair_id, at desc);

-- ── 10. Events ────────────────────────────────────────────────────────────
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'formation',     -- formation|service|mass|other
  title text not null,
  when_ts timestamptz not null,
  end_ts timestamptz,
  where_text text,
  chapter_id uuid references public.chapters(id) on delete set null,
  latin text,
  capacity int,
  description text,
  speakers jsonb default '[]'::jsonb,
  created_by_user_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists events_when_idx on public.events(when_ts);
create index if not exists events_chapter_idx on public.events(chapter_id, when_ts);

create table if not exists public.event_attendance (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'rsvp',   -- rsvp|present|no-show
  recorded_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

-- ── 11. Service matters (the pro-bono case lifecycle) ────────────────────
create table if not exists public.service_matters (
  id uuid primary key default gen_random_uuid(),
  intake_date date not null default current_date,
  requester text,
  primary_contact text,
  languages text[] default '{}',
  region text,
  category text,
  summary text,
  status matter_lifecycle_state not null default 'intake-scheduled',
  assigned_to_user_id uuid references auth.users(id) on delete set null,
  opposing_parties text[] default '{}',
  priority text default 'standard',
  urgency_score int default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists service_matters_status_idx on public.service_matters(status);

create table if not exists public.matter_messages (
  id uuid primary key default gen_random_uuid(),
  matter_id uuid not null references public.service_matters(id) on delete cascade,
  from_role text not null,        -- lawyer|client|steward|system
  sent_at timestamptz not null default now(),
  body text not null,
  channel text default 'platform' -- platform|sms|email|in-person
);
create index if not exists matter_messages_matter_idx
  on public.matter_messages(matter_id, sent_at);

create table if not exists public.matter_documents (
  id uuid primary key default gen_random_uuid(),
  matter_id uuid not null references public.service_matters(id) on delete cascade,
  filename text not null,
  kind text not null,
  size_kb int,
  storage_path text,        -- Supabase Storage object key
  uploaded_at timestamptz not null default now(),
  uploaded_by_role text not null
);

create table if not exists public.matter_drafts (
  id uuid primary key default gen_random_uuid(),
  requester_first_name text not null,
  category text not null,
  region text not null,
  languages text[] default '{}',
  summary text not null,
  appeal_text text,
  appeal_consents jsonb,
  opposing_party text,
  source text not null,           -- auxilium|voice-intake|intake-assist|manual
  submitted_at timestamptz not null default now(),
  status text not null default 'new',  -- new|in-review|published|declined
  published_matter_id uuid references public.service_matters(id),
  conflict_check jsonb,           -- ConflictCheckSnapshot
  created_by_user_id uuid references auth.users(id)
);

create table if not exists public.closure_summaries (
  matter_id uuid primary key references public.service_matters(id) on delete cascade,
  summary text not null,
  consent_verified boolean not null default false,
  sent_to_referrer boolean not null default false,
  signed_at timestamptz not null default now()
);

-- Append-only audit log of every conflict check. Never UPDATE/DELETE.
create table if not exists public.conflict_audit_log (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid references public.matter_drafts(id),
  checked_at timestamptz not null default now(),
  checked_by_user_id uuid references auth.users(id),
  cleared boolean not null,
  hashes_checked int not null,
  hits jsonb not null default '[]'::jsonb,
  override jsonb
);

-- ── 12. Per-user matter wiring ───────────────────────────────────────────
create table if not exists public.matter_accepted (
  user_id uuid not null references auth.users(id) on delete cascade,
  matter_id uuid not null references public.service_matters(id) on delete cascade,
  accepted_at timestamptz not null default now(),
  primary key (user_id, matter_id)
);

create table if not exists public.matter_saved (
  user_id uuid not null references auth.users(id) on delete cascade,
  matter_id uuid not null references public.service_matters(id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (user_id, matter_id)
);

create table if not exists public.logged_hours (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  matter_id uuid references public.service_matters(id) on delete set null,
  hours numeric(5,2) not null,
  log_date date not null,
  note text,
  logged_at timestamptz not null default now()
);
create index if not exists logged_hours_user_idx on public.logged_hours(user_id, log_date desc);

-- ── 13. updated_at trigger (reusable) ────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

do $$ declare t text;
begin
  for t in select unnest(array[
    'profiles', 'chapters', 'mentor_pairs', 'pair_meetings',
    'events', 'service_matters'
  ])
  loop
    execute format(
      'drop trigger if exists trg_touch_updated_at on public.%I;
       create trigger trg_touch_updated_at before update on public.%I
       for each row execute function public.touch_updated_at();', t, t);
  end loop;
end $$;

-- ── 14. handle_new_user trigger — auto-create profile on signup ──────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, display_name, first_name, timezone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'first_name',
             split_part(coalesce(new.raw_user_meta_data->>'display_name', new.email), ' ', 1)),
    coalesce(new.raw_user_meta_data->>'timezone', 'America/Chicago')
  )
  on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 15. RLS — enable on every Collegium table ────────────────────────────
do $$ declare t text;
begin
  for t in select unnest(array[
    'profiles', 'user_roles', 'chapters',
    'mentor_pairs', 'pair_meetings', 'pair_outcomes',
    'mentorship_requests', 'integration_connections',
    'saved_excerpts', 'enrolled_tracks', 'track_progress',
    'devotional_pocketbook', 'mentor_journal',
    'events', 'event_attendance',
    'service_matters', 'matter_messages', 'matter_documents',
    'matter_drafts', 'closure_summaries', 'conflict_audit_log',
    'matter_accepted', 'matter_saved', 'logged_hours'
  ])
  loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- Helper: is the current user an admin or a steward?
create or replace function public.is_steward_or_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role in ('admin', 'steward')
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: is the current user a member of the given pair?
create or replace function public.is_pair_member(pair uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.mentor_pairs p
    where p.id = pair
      and (p.mentor_id = auth.uid() or p.mentee_id = auth.uid())
  );
$$;

-- ── 16. RLS policies ─────────────────────────────────────────────────────
-- profiles — anyone signed in can read public roster; user updates own;
-- stewards can update any (for is_approved gating).
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated using (true);
drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid());
drop policy if exists "profiles_update_steward" on public.profiles;
create policy "profiles_update_steward" on public.profiles
  for update to authenticated using (public.is_steward_or_admin())
  with check (public.is_steward_or_admin());
drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert to authenticated with check (user_id = auth.uid());

-- user_roles — readable by authenticated; only admins write.
drop policy if exists "user_roles_select" on public.user_roles;
create policy "user_roles_select" on public.user_roles
  for select to authenticated using (true);
drop policy if exists "user_roles_admin_write" on public.user_roles;
create policy "user_roles_admin_write" on public.user_roles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- chapters — anyone reads; stewards write.
drop policy if exists "chapters_select" on public.chapters;
create policy "chapters_select" on public.chapters for select using (true);
drop policy if exists "chapters_steward_write" on public.chapters;
create policy "chapters_steward_write" on public.chapters
  for all to authenticated using (public.is_steward_or_admin())
  with check (public.is_steward_or_admin());

-- mentor_pairs — pair members + stewards read; stewards + pair members write.
drop policy if exists "mentor_pairs_select" on public.mentor_pairs;
create policy "mentor_pairs_select" on public.mentor_pairs
  for select to authenticated using (
    mentor_id = auth.uid() or mentee_id = auth.uid() or public.is_steward_or_admin()
  );
drop policy if exists "mentor_pairs_write" on public.mentor_pairs;
create policy "mentor_pairs_write" on public.mentor_pairs
  for all to authenticated using (
    mentor_id = auth.uid() or mentee_id = auth.uid() or public.is_steward_or_admin()
  ) with check (
    mentor_id = auth.uid() or mentee_id = auth.uid() or public.is_steward_or_admin()
  );

-- pair_meetings / pair_outcomes / integration_connections / mentor_journal
-- — all gated through is_pair_member.
do $$ declare t text;
begin
  for t in select unnest(array[
    'pair_meetings', 'pair_outcomes',
    'integration_connections', 'mentor_journal'
  ])
  loop
    execute format($f$
      drop policy if exists "%1$s_select" on public.%1$I;
      create policy "%1$s_select" on public.%1$I
        for select to authenticated using (
          public.is_pair_member(pair_id) or public.is_steward_or_admin()
        );
      drop policy if exists "%1$s_write" on public.%1$I;
      create policy "%1$s_write" on public.%1$I
        for all to authenticated using (
          public.is_pair_member(pair_id) or public.is_steward_or_admin()
        ) with check (
          public.is_pair_member(pair_id) or public.is_steward_or_admin()
        );
    $f$, t);
  end loop;
end $$;

-- mentorship_requests — sender or recipient.
drop policy if exists "mentorship_requests_select" on public.mentorship_requests;
create policy "mentorship_requests_select" on public.mentorship_requests
  for select to authenticated using (
    from_user_id = auth.uid() or to_user_id = auth.uid()
    or public.is_steward_or_admin()
  );
drop policy if exists "mentorship_requests_insert" on public.mentorship_requests;
create policy "mentorship_requests_insert" on public.mentorship_requests
  for insert to authenticated with check (from_user_id = auth.uid());
drop policy if exists "mentorship_requests_update" on public.mentorship_requests;
create policy "mentorship_requests_update" on public.mentorship_requests
  for update to authenticated using (
    to_user_id = auth.uid() or from_user_id = auth.uid()
    or public.is_steward_or_admin()
  );

-- Per-user tables: user_id = auth.uid() owns everything.
do $$ declare t text;
begin
  for t in select unnest(array[
    'saved_excerpts', 'enrolled_tracks', 'track_progress',
    'devotional_pocketbook', 'matter_accepted', 'matter_saved',
    'logged_hours'
  ])
  loop
    execute format($f$
      drop policy if exists "%1$s_own" on public.%1$I;
      create policy "%1$s_own" on public.%1$I
        for all to authenticated using (user_id = auth.uid())
        with check (user_id = auth.uid());
      drop policy if exists "%1$s_steward_read" on public.%1$I;
      create policy "%1$s_steward_read" on public.%1$I
        for select to authenticated using (public.is_steward_or_admin());
    $f$, t);
  end loop;
end $$;

-- events — anyone reads; stewards write; attendance row is per user.
drop policy if exists "events_select" on public.events;
create policy "events_select" on public.events for select using (true);
drop policy if exists "events_steward_write" on public.events;
create policy "events_steward_write" on public.events
  for all to authenticated using (public.is_steward_or_admin())
  with check (public.is_steward_or_admin());

drop policy if exists "event_attendance_own" on public.event_attendance;
create policy "event_attendance_own" on public.event_attendance
  for all to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid());
drop policy if exists "event_attendance_steward" on public.event_attendance;
create policy "event_attendance_steward" on public.event_attendance
  for all to authenticated using (public.is_steward_or_admin())
  with check (public.is_steward_or_admin());

-- service_matters + matter_messages/documents — stewards full; assigned
-- lawyer reads/writes own matter.
drop policy if exists "service_matters_select" on public.service_matters;
create policy "service_matters_select" on public.service_matters
  for select to authenticated using (
    assigned_to_user_id = auth.uid() or public.is_steward_or_admin()
    or exists(
      select 1 from public.matter_accepted ma
      where ma.matter_id = service_matters.id and ma.user_id = auth.uid()
    )
  );
drop policy if exists "service_matters_steward_write" on public.service_matters;
create policy "service_matters_steward_write" on public.service_matters
  for all to authenticated using (public.is_steward_or_admin())
  with check (public.is_steward_or_admin());

do $$ declare t text;
begin
  for t in select unnest(array['matter_messages', 'matter_documents'])
  loop
    execute format($f$
      drop policy if exists "%1$s_select" on public.%1$I;
      create policy "%1$s_select" on public.%1$I
        for select to authenticated using (
          public.is_steward_or_admin() or exists(
            select 1 from public.service_matters sm
            where sm.id = %1$I.matter_id
              and (sm.assigned_to_user_id = auth.uid() or exists(
                select 1 from public.matter_accepted ma
                where ma.matter_id = sm.id and ma.user_id = auth.uid()
              ))
          )
        );
      drop policy if exists "%1$s_write" on public.%1$I;
      create policy "%1$s_write" on public.%1$I
        for all to authenticated using (
          public.is_steward_or_admin() or exists(
            select 1 from public.service_matters sm
            where sm.id = %1$I.matter_id and sm.assigned_to_user_id = auth.uid()
          )
        ) with check (
          public.is_steward_or_admin() or exists(
            select 1 from public.service_matters sm
            where sm.id = %1$I.matter_id and sm.assigned_to_user_id = auth.uid()
          )
        );
    $f$, t);
  end loop;
end $$;

-- matter_drafts — creator can read own + stewards full.
drop policy if exists "matter_drafts_creator" on public.matter_drafts;
create policy "matter_drafts_creator" on public.matter_drafts
  for select to authenticated using (
    created_by_user_id = auth.uid() or public.is_steward_or_admin()
  );
drop policy if exists "matter_drafts_insert" on public.matter_drafts;
create policy "matter_drafts_insert" on public.matter_drafts
  for insert to authenticated with check (true);
drop policy if exists "matter_drafts_steward_write" on public.matter_drafts;
create policy "matter_drafts_steward_write" on public.matter_drafts
  for update to authenticated using (public.is_steward_or_admin());

-- closure_summaries — same access as parent matter; stewards full.
drop policy if exists "closure_select" on public.closure_summaries;
create policy "closure_select" on public.closure_summaries
  for select to authenticated using (
    public.is_steward_or_admin() or exists(
      select 1 from public.service_matters sm
      where sm.id = closure_summaries.matter_id
        and sm.assigned_to_user_id = auth.uid()
    )
  );
drop policy if exists "closure_write" on public.closure_summaries;
create policy "closure_write" on public.closure_summaries
  for all to authenticated using (public.is_steward_or_admin())
  with check (public.is_steward_or_admin());

-- conflict_audit_log — APPEND-ONLY (insert only, no update/delete);
-- stewards read.
drop policy if exists "conflict_audit_insert" on public.conflict_audit_log;
create policy "conflict_audit_insert" on public.conflict_audit_log
  for insert to authenticated with check (public.is_steward_or_admin());
drop policy if exists "conflict_audit_select" on public.conflict_audit_log;
create policy "conflict_audit_select" on public.conflict_audit_log
  for select to authenticated using (public.is_steward_or_admin());
-- (no update / delete policies — RLS deny-by-default closes the loop)

-- ── 17. Realtime publication (so the in-app NRI + journal stay live) ─────
do $$ begin
  perform 1 from pg_publication where pubname = 'supabase_realtime';
  if not found then return; end if;
  -- Add tables to the supabase_realtime publication if not already there.
  perform 1; -- intentional no-op block; Supabase auto-publishes new tables
end $$;

alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.mentor_pairs;
alter publication supabase_realtime add table public.pair_meetings;
alter publication supabase_realtime add table public.pair_outcomes;
alter publication supabase_realtime add table public.mentorship_requests;
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.service_matters;
alter publication supabase_realtime add table public.matter_messages;
alter publication supabase_realtime add table public.mentor_journal;

-- ============================================================================
--  END OF CORE SCHEMA. Seed data is in 02_seed.sql (optional).
-- ============================================================================
