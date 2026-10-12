-- TradeJournal Pro — Supabase schema for a NEW project.
-- Run in Supabase Dashboard → SQL Editor. If you already have data/tables,
-- back them up and compare schemas before applying any migration.
-- Row Level Security ensures users can access only their own rows.

create extension if not exists pgcrypto;

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  trade_date date not null,
  symbol text not null,
  side text not null check (side in ('long', 'short')),
  setup text not null default 'Other',
  entry_price numeric not null,
  exit_price numeric,
  trade_status text not null default 'closed' check (trade_status in ('open', 'closed')),
  contracts numeric not null default 1 check (contracts > 0),
  point_value numeric not null default 1 check (point_value >= 0),
  fees numeric not null default 0 check (fees >= 0),
  net_pnl numeric,
  stop_price numeric,
  target_price numeric,
  mood text,
  followed_rules text check (followed_rules in ('yes', 'partial', 'no') or followed_rules is null),
  execution_grade text check (execution_grade in ('A', 'B', 'C', 'D') or execution_grade is null),
  notes text,
  screenshot_url text,
  created_at timestamptz not null default now()
);

alter table public.trades enable row level security;

drop policy if exists "Users can read their own trades" on public.trades;
create policy "Users can read their own trades"
  on public.trades for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own trades" on public.trades;
create policy "Users can insert their own trades"
  on public.trades for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own trades" on public.trades;
create policy "Users can update their own trades"
  on public.trades for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own trades" on public.trades;
create policy "Users can delete their own trades"
  on public.trades for delete to authenticated
  using (auth.uid() = user_id);

create index if not exists trades_user_date_idx
  on public.trades (user_id, trade_date desc, created_at desc);

create table if not exists public.quiz_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{"attempted": {}, "mastered": {}}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.quiz_progress enable row level security;

drop policy if exists "Users can read their own quiz progress" on public.quiz_progress;
create policy "Users can read their own quiz progress"
  on public.quiz_progress for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own quiz progress" on public.quiz_progress;
create policy "Users can insert their own quiz progress"
  on public.quiz_progress for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own quiz progress" on public.quiz_progress;
create policy "Users can update their own quiz progress"
  on public.quiz_progress for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
