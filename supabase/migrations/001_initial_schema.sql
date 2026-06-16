-- Anti-Drift OS initial schema

create extension if not exists "pgcrypto";

-- Goals
create table goals (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('wealth', 'business', 'marriage', 'health', 'golf', 'character')),
  title text not null,
  description text,
  target_value numeric,
  current_value numeric default 0,
  unit text,
  deadline date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Daily check-ins
create table daily_checkins (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  built_something boolean default false,
  career_progress boolean default false,
  quality_time_with_wife boolean default false,
  exercise_or_golf boolean default false,
  no_secret_behavior boolean default false,
  sleep_hours numeric,
  notes text,
  created_at timestamptz default now()
);

-- Journal entries
create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  wins text,
  errors text,
  trigger text,
  root_cause text,
  system_fix text,
  gratitude text,
  future_self_note text,
  created_at timestamptz default now()
);

-- Relapse logs
create table relapse_logs (
  id uuid primary key default gen_random_uuid(),
  urge_level integer check (urge_level between 1 and 10),
  emotion text,
  location text,
  time_of_day text,
  behavior text,
  money_spent numeric default 0,
  notes text,
  created_at timestamptz default now()
);

-- Weekly CEO reviews
create table weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  week_start date unique not null,
  wins text,
  leaks text,
  risks text,
  root_cause text,
  next_system text,
  business_score integer,
  health_score integer,
  marriage_score integer,
  discipline_score integer,
  overall_drift_score integer,
  ceo_summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Identity manifesto (single row)
create table identity_manifesto (
  id integer primary key default 1,
  constraint single_row check (id = 1),
  age_35_vision text,
  life_principles text,
  fear_of_drift text,
  identity_statement text,
  updated_at timestamptz default now()
);

-- Emergency sessions
create table emergency_sessions (
  id uuid primary key default gen_random_uuid(),
  emotions text[] not null,
  urgency integer check (urgency between 1 and 10),
  predicted_feeling text,
  estimated_cost numeric default 0,
  moved_towards_identity boolean,
  urge_passed boolean,
  duration_seconds integer,
  created_at timestamptz default now()
);

-- Updated_at triggers
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger goals_updated_at
  before update on goals
  for each row execute function update_updated_at();

create trigger identity_manifesto_updated_at
  before update on identity_manifesto
  for each row execute function update_updated_at();

create trigger weekly_reviews_updated_at
  before update on weekly_reviews
  for each row execute function update_updated_at();
