-- Paste this into Supabase → SQL Editor → New query → Run

create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric not null default 0,
  category text,
  materials text,
  colors text[] default '{}',
  stock int default 1,
  featured boolean default true,
  sold_out boolean default false,
  images text[] default '{}',
  description text,
  created_at timestamptz default now()
);

create table if not exists public.showcase (
  slot int primary key,
  image_url text default ''
);

insert into public.showcase (slot, image_url) values (0, ''), (1, ''), (2, '')
on conflict (slot) do nothing;

create table if not exists public.orders (
  id text primary key,
  created_at timestamptz default now(),
  status text default 'Pending',
  customer jsonb,
  items jsonb,
  subtotal numeric,
  shipping numeric,
  total numeric,
  email text
);

alter table public.products enable row level security;
alter table public.showcase enable row level security;
alter table public.orders enable row level security;

drop policy if exists products_all on public.products;
create policy products_all on public.products for all using (true) with check (true);

drop policy if exists showcase_all on public.showcase;
create policy showcase_all on public.showcase for all using (true) with check (true);

drop policy if exists orders_all on public.orders;
create policy orders_all on public.orders for all using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read on storage.objects
for select using (bucket_id = 'product-images');

drop policy if exists product_images_public_write on storage.objects;
create policy product_images_public_write on storage.objects
for insert with check (bucket_id = 'product-images');

drop policy if exists product_images_public_update on storage.objects;
create policy product_images_public_update on storage.objects
for update using (bucket_id = 'product-images');
