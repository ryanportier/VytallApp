-- ============================================================
-- VYTALL — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── USERS ───────────────────────────────────────────────────
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  name text not null,
  goal text not null,
  level text not null check (level in ('beginner', 'intermediate', 'advanced', 'elite')),
  equipment text[] not null default '{}',
  session_preference integer not null default 45,
  days_per_week integer not null default 4,
  restrictions text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.users for insert with check (auth.uid() = id);

-- ─── DAILY CHECK-INS ─────────────────────────────────────────
create table public.daily_checkins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  energy integer not null check (energy between 1 and 10),
  sleep_quality integer not null check (sleep_quality between 1 and 10),
  fatigue integer not null check (fatigue between 1 and 10),
  mood integer not null check (mood between 1 and 10),
  soreness text[] not null default '{}',
  time_available integer not null default 45,
  note text,
  readiness_score integer not null default 0,
  mode text not null check (mode in ('FORGE', 'RESTORE', 'MAINTAIN', 'PUSH', 'RECOVER')),
  ai_summary text not null default '',
  created_at timestamptz not null default now()
);

alter table public.daily_checkins enable row level security;
create policy "Users can manage own checkins" on public.daily_checkins
  for all using (auth.uid() = user_id);

create index idx_checkins_user_date on public.daily_checkins (user_id, created_at desc);

-- ─── WORKOUTS ────────────────────────────────────────────────
create table public.workouts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  session_type text not null,
  duration_minutes integer not null default 0,
  completion_status text not null default 'planned'
    check (completion_status in ('planned', 'in_progress', 'completed', 'skipped')),
  user_note text,
  ai_reflection text,
  created_at timestamptz not null default now()
);

alter table public.workouts enable row level security;
create policy "Users can manage own workouts" on public.workouts
  for all using (auth.uid() = user_id);

create index idx_workouts_user_date on public.workouts (user_id, created_at desc);

-- ─── EXERCISE RESULTS ────────────────────────────────────────
create table public.exercise_results (
  id uuid primary key default uuid_generate_v4(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_name text not null,
  sets integer not null default 0,
  reps integer not null default 0,
  duration_seconds integer,
  effort_score integer check (effort_score between 1 and 10),
  created_at timestamptz not null default now()
);

alter table public.exercise_results enable row level security;
create policy "Users can manage own exercise results" on public.exercise_results
  for all using (
    auth.uid() = (select user_id from public.workouts where id = workout_id)
  );

-- ─── VIDEO ANALYSES ──────────────────────────────────────────
create table public.video_analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  workout_id uuid references public.workouts(id) on delete set null,
  exercise_name text not null,
  video_url text not null,
  technique_score integer check (technique_score between 0 and 100),
  tempo_score integer check (tempo_score between 0 and 100),
  rom_score integer check (rom_score between 0 and 100),
  stability_score integer check (stability_score between 0 and 100),
  corrections text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.video_analyses enable row level security;
create policy "Users can manage own video analyses" on public.video_analyses
  for all using (auth.uid() = user_id);

-- ─── ARCHIVE ENTRIES ─────────────────────────────────────────
create table public.archive_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  body text not null,
  entry_type text not null check (entry_type in ('chapter', 'breakthrough', 'setback', 'recovery', 'era')),
  created_at timestamptz not null default now()
);

alter table public.archive_entries enable row level security;
create policy "Users can manage own archive" on public.archive_entries
  for all using (auth.uid() = user_id);

create index idx_archive_user_date on public.archive_entries (user_id, created_at desc);

-- ─── GHOST SNAPSHOTS ─────────────────────────────────────────
create table public.ghost_snapshots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  consistency_score integer check (consistency_score between 0 and 100),
  readiness_score integer check (readiness_score between 0 and 100),
  technique_score integer check (technique_score between 0 and 100),
  strength_score integer check (strength_score between 0 and 100),
  recovery_score integer check (recovery_score between 0 and 100),
  summary text not null default '',
  created_at timestamptz not null default now()
);

alter table public.ghost_snapshots enable row level security;
create policy "Users can manage own ghost snapshots" on public.ghost_snapshots
  for all using (auth.uid() = user_id);

create index idx_ghost_user_date on public.ghost_snapshots (user_id, created_at desc);

-- ─── SUBSCRIPTIONS ───────────────────────────────────────────
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text not null,
  plan text not null check (plan in ('free', 'premium', 'elite')),
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')),
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

-- ─── X402 PAYMENTS ───────────────────────────────────────────
-- Run this if you already have the table: ALTER TABLE public.x402_payments ADD COLUMN IF NOT EXISTS tx_hash text;
create table public.x402_payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  feature_key text not null,
  amount numeric(10,6) not null,
  status text not null check (status in ('pending', 'completed', 'failed')),
  tx_hash text,
  created_at timestamptz not null default now()
);

alter table public.x402_payments enable row level security;
create policy "Users can view own x402 payments" on public.x402_payments
  for select using (auth.uid() = user_id);

-- ─── HELPER: Get user's peak ghost snapshot ──────────────────
create or replace function public.get_peak_ghost(p_user_id uuid)
returns public.ghost_snapshots
language sql
security definer
as $$
  select *
  from public.ghost_snapshots
  where user_id = p_user_id
  order by (consistency_score + readiness_score + technique_score + strength_score + recovery_score) desc
  limit 1;
$$;
