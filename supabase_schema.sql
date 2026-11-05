-- Schema SQL para Rádio UEG Educativa • CriaLab|UEG (Supabase)
-- Execute no SQL Editor do Supabase quando quiser sincronizar a Grade e Notícias na nuvem.

create table if not exists public.radio_schedule (
  id text primary key,
  title text not null,
  subtitle text not null,
  category text not null,
  days integer[] not null default '{0,1,2,3,4,5,6}',
  start_time text not null,
  end_time text not null,
  cover_url text not null,
  logo_url text,
  accent_color text default '#158481',
  has_live_video boolean default false,
  youtube_live_url text,
  spotify_url text,
  description text,
  credits jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.radio_news (
  id text primary key,
  title text not null,
  summary text not null,
  content text not null,
  category text not null,
  date_label text not null,
  read_time text default '3 min',
  author text not null,
  image_url text not null,
  related_program_id text,
  created_at timestamptz default now()
);

alter table public.radio_schedule enable row level security;
alter table public.radio_news enable row level security;

create policy "Leitura pública da programação"
  on public.radio_schedule for select
  using (true);

create policy "Leitura pública das notícias"
  on public.radio_news for select
  using (true);
