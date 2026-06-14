-- Life OS - Initial Schema
-- Single-user personal life intelligence system.
-- Everything is stored as a "Life Object" with relationships and a full activity history.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type life_object_type as enum (
  'idea',
  'project',
  'goal',
  'learning',
  'decision',
  'reflection',
  'achievement',
  'event',
  'habit',
  'note'
);

create type life_object_status as enum (
  'new',
  'active',
  'paused',
  'completed',
  'cancelled',
  'archived'
);

create type relationship_type as enum (
  'related_to',
  'created_from',
  'supports',
  'depends_on',
  'inspired_by',
  'resulted_in'
);

create type activity_action as enum (
  'created',
  'updated',
  'status_changed',
  'progress_updated',
  'paused',
  'resumed',
  'completed',
  'cancelled',
  'archived',
  'relationship_added',
  'relationship_removed',
  'deleted'
);

-- ---------------------------------------------------------------------------
-- Life Objects
-- ---------------------------------------------------------------------------

create table life_objects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null,
  description text,
  type life_object_type not null default 'note',
  status life_object_status not null default 'new',
  progress smallint not null default 0 check (progress >= 0 and progress <= 100),

  tags text[] not null default '{}',

  importance smallint check (importance >= 1 and importance <= 5),
  energy smallint check (energy >= 1 and energy <= 5),
  notes text,

  start_date date,
  target_date date,
  completed_date date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index life_objects_user_id_idx on life_objects (user_id);
create index life_objects_type_idx on life_objects (user_id, type);
create index life_objects_status_idx on life_objects (user_id, status);
create index life_objects_created_at_idx on life_objects (user_id, created_at desc);
create index life_objects_tags_idx on life_objects using gin (tags);
create index life_objects_search_idx on life_objects using gin (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(notes, ''))
);

-- ---------------------------------------------------------------------------
-- Relationships between Life Objects
-- ---------------------------------------------------------------------------

create table life_object_relationships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  from_object_id uuid not null references life_objects(id) on delete cascade,
  to_object_id uuid not null references life_objects(id) on delete cascade,
  relationship_type relationship_type not null default 'related_to',

  created_at timestamptz not null default now(),

  constraint no_self_relationship check (from_object_id <> to_object_id),
  constraint unique_relationship unique (from_object_id, to_object_id, relationship_type)
);

create index relationships_from_idx on life_object_relationships (from_object_id);
create index relationships_to_idx on life_object_relationships (to_object_id);
create index relationships_user_id_idx on life_object_relationships (user_id);

-- ---------------------------------------------------------------------------
-- Activity History (full audit log - nothing is lost)
-- ---------------------------------------------------------------------------

create table activity_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  life_object_id uuid references life_objects(id) on delete cascade,

  action activity_action not null,
  field_changed text,
  old_value text,
  new_value text,
  summary text,

  created_at timestamptz not null default now()
);

create index activity_history_user_id_idx on activity_history (user_id);
create index activity_history_object_idx on activity_history (life_object_id);
create index activity_history_created_at_idx on activity_history (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Daily Reflections
-- ---------------------------------------------------------------------------

create table daily_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reflection_date date not null default current_date,
  content text not null,
  mood smallint check (mood >= 1 and mood <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint unique_reflection_per_day unique (user_id, reflection_date)
);

create index daily_reflections_user_idx on daily_reflections (user_id, reflection_date desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger life_objects_set_updated_at
  before update on life_objects
  for each row
  execute function set_updated_at();

create trigger daily_reflections_set_updated_at
  before update on daily_reflections
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security (single user, owner-only access)
-- ---------------------------------------------------------------------------

alter table life_objects enable row level security;
alter table life_object_relationships enable row level security;
alter table activity_history enable row level security;
alter table daily_reflections enable row level security;

create policy "Owner can manage life objects"
  on life_objects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Owner can manage relationships"
  on life_object_relationships for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Owner can manage activity history"
  on activity_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Owner can manage daily reflections"
  on daily_reflections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
