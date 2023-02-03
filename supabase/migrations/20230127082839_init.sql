create table public.events (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  name text not null,
  duration integer default 0 not null,
  unique(user_id, name)
);
alter table public.events enable row level security;
create policy "Allow read own data" on public.events
  for select using (auth.uid() = user_id);
create policy "Allow individual insert access" on public.events
  for insert with check (auth.uid() = id);
create policy "Allow individual update access" on public.events
  for update using (auth.uid() = user_id);
  create policy "Allow individual delete access" on public.events
  for delete using (auth.uid() = user_id);

create table public.logs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  duration integer default 0 not null,
  user_id uuid references auth.users not null,
  event_id uuid references public.events not null
);
alter table public.logs enable row level security;
create policy "Allow read own data" on public.logs
  for select using (auth.uid() = user_id);
create policy "Allow individual insert access" on public.logs
  for insert with check (auth.uid() = id);
create policy "Allow individual update access" on public.logs
  for update using (auth.uid() = user_id);
  create policy "Allow individual delete access" on public.logs
  for delete using (auth.uid() = user_id);
