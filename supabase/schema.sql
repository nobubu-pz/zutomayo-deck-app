-- Drop existing tables if they exist
drop table if exists public.friendships;
drop table if exists public.user_cards;
drop table if exists public.user_decks;
drop table if exists public.profiles;

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text,
  friend_code text unique,
  is_public boolean default true not null,
  last_viewed_friends_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_cards table
create table public.user_cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  card_uid text not null,
  count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, card_uid)
);

-- Create user_decks table
create table public.user_decks (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  cards jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create friendships table
create table public.friendships (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(sender_id, receiver_id)
);

-- Set up Row Level Security (RLS)

alter table public.profiles enable row level security;
alter table public.user_cards enable row level security;
alter table public.user_decks enable row level security;
alter table public.friendships enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- User_cards policies
create policy "Users can view own cards" on public.user_cards for select using (auth.uid() = user_id);
create policy "Users can view friends cards" on public.user_cards for select using (
    exists (
      select 1 from public.friendships f
      where (f.sender_id = auth.uid() and f.receiver_id = user_cards.user_id and f.status = 'accepted')
         or (f.receiver_id = auth.uid() and f.sender_id = user_cards.user_id and f.status = 'accepted')
    )
    and exists (
      select 1 from public.profiles p
      where p.id = user_cards.user_id and p.is_public = true
    )
);
create policy "Users can insert own cards" on public.user_cards for insert with check (auth.uid() = user_id);
create policy "Users can update own cards" on public.user_cards for update using (auth.uid() = user_id);
create policy "Users can delete own cards" on public.user_cards for delete using (auth.uid() = user_id);

-- User_decks policies
create policy "Users can view own decks" on public.user_decks for select using (auth.uid() = user_id);
create policy "Users can insert own decks" on public.user_decks for insert with check (auth.uid() = user_id);
create policy "Users can update own decks" on public.user_decks for update using (auth.uid() = user_id);
create policy "Users can delete own decks" on public.user_decks for delete using (auth.uid() = user_id);

-- Friendships policies
create policy "Users can view their friendships" on public.friendships for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can create friendships" on public.friendships for insert with check (auth.uid() = sender_id);
create policy "Users can update received friendships" on public.friendships for update using (auth.uid() = receiver_id);
create policy "Users can delete their friendships" on public.friendships for delete using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Function to handle new user creation automatically via triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, friend_code)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', 'Player'),
    upper(substring(md5(new.id::text) from 1 for 8)) -- generate an 8-char hex code
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile when auth.users is populated
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
