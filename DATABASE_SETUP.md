# Database Setup for Paste-Life

## Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Create pastes table
create table public.pastes (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text,
  content text not null,
  language text,
  privacy text not null default 'unlisted',
  secret_token text not null,
  created_at timestamptz default now(),
  expires_at timestamptz,
  views int default 0
);

-- Create indexes
create index on public.pastes (created_at desc);
create index on public.pastes (slug);
create index on public.pastes using gin ((to_tsvector('english', coalesce(title,'') || ' ' || content)));

-- Enable Row Level Security
alter table public.pastes enable row level security;

-- RLS Policy: Anyone can read public and unlisted pastes
create policy "Public and unlisted pastes are viewable by anyone"
  on public.pastes for select
  using (privacy in ('public', 'unlisted'));

-- RLS Policy: Anyone can insert pastes
create policy "Anyone can create pastes"
  on public.pastes for insert
  with check (true);

-- Note: Private pastes, edit, and delete operations must go through 
-- the backend API which uses the service role key to bypass RLS
```

## Important Security Notes

1. **Frontend (Anon Key)**: Can only read public/unlisted pastes and create new pastes
2. **Backend (Service Role Key)**: Handles private paste access, edit, and delete with token verification
3. **Secret Tokens**: Never expose in frontend; always verify server-side

## Testing Your Setup

After running the SQL above, test with:

```sql
-- Insert a test paste
insert into public.pastes (slug, content, privacy, secret_token)
values ('test123', 'Hello World', 'public', 'test-secret');

-- Query it
select * from public.pastes where slug = 'test123';
```
