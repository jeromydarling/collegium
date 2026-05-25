-- ============================================================================
--  COLLEGIUM — SEED DATA  (optional)
--  ----------------------------------------------------------------------------
--  A handful of chapters + a sample event so a fresh project isn't
--  visually empty. Apply AFTER collegium_schema.sql.
--
--  Idempotent: inserts use ON CONFLICT DO NOTHING.
-- ============================================================================

insert into public.chapters (id, name, city, region, latin_motto, blurb, founded_on, latitude, longitude)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Boston Chapter — Iustitia in Patria',
    'Boston, MA',
    'New England',
    'Iustitia in Patria',
    'The founding chapter. Monthly Mass at the Cathedral of the Holy Cross, mentor matching across the metro, and a Saturday housing-court clinic.',
    '2024-09-01',
    42.336, -71.071
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'D.C. Chapter — Pro Patria et Lege',
    'Washington, DC',
    'Mid-Atlantic',
    'Pro Patria et Lege',
    'The Catholic University of America anchor. Reading groups in the Treatise on Law, weekly Rosary in the chapel, and a mentor-match program across the metro.',
    '2024-09-15',
    38.907, -77.036
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Chicago Chapter — Civitas Domini',
    'Chicago, IL',
    'Midwest',
    'Civitas Domini',
    'St. Stanislaus parish home. NIJC immigration clinic, indigent defense rotation, and a midweek Office of Readings in Old St. Pat''s.',
    '2025-01-15',
    41.879, -87.629
  )
on conflict (id) do nothing;

-- A sample upcoming event so the public events list isn't empty on
-- first run.
insert into public.events (id, kind, title, when_ts, where_text, chapter_id, latin, capacity, description)
values
  (
    'aaaaaaa1-0000-0000-0000-000000000001',
    'mass',
    'Red Mass — Opening of the Judicial Year',
    (now() at time zone 'UTC' + interval '14 days') + time '17:30',
    'Cathedral of the Holy Cross',
    '11111111-1111-1111-1111-111111111111',
    'Missa Rubra · Apertio Anni Iudicialis',
    400,
    'Annual Red Mass at the start of the judicial term, marking the legal year with prayer for wisdom and justice.'
  )
on conflict (id) do nothing;

-- Note: the in-app devotional library, library excerpts, weekly arcs, and
-- formation tracks all live in the app bundle (src/collegium/content/)
-- rather than in the database. They are static reference material and
-- compile in with the app — Supabase only persists user-generated state
-- against them (saved_excerpts, enrolled_tracks, track_progress).
