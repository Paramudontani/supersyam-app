create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  amount integer not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "pk_test_51UAucYFhLsnwU5IBiQ9qWHdx8bpNJR1vxh8P7AVAatktG2mrTv0aMOkGsYWhaveOt6YOExsRVSvoZmqmZ7nPF8mY00m5uf2kcm"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "sk_test_51UAucYFhLsnwU5IBRhLxakfa7haMBig1eNFOofaOF5T6GnYWHW0DZwVRMXtsQNM7CpYgsite1zAgl2f1b9YVdSQo00XOl3pMo8"
  on public.bookings for insert
  with check (auth.uid() = user_id);
