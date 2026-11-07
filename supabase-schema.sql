create extension if not exists pgcrypto;

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  creator_name text not null check (char_length(creator_name) between 1 and 40),
  answers jsonb not null check (jsonb_typeof(answers) = 'array' and jsonb_array_length(answers) = 21),
  creator_token text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  participant_name text not null check (char_length(participant_name) between 1 and 40),
  answers jsonb not null check (jsonb_typeof(answers) = 'array' and jsonb_array_length(answers) = 21),
  score integer not null check (score between 0 and 21),
  created_at timestamptz not null default now()
);

create index if not exists attempts_challenge_score_idx
  on public.attempts (challenge_id, score desc, created_at asc);

alter table public.challenges enable row level security;
alter table public.attempts enable row level security;
