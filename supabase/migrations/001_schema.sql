-- ═══════════════════════════════════════════════════════════
-- HOORAB'S COLLECTION — FULL DATABASE SCHEMA
-- Run this in Supabase → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES (extends Supabase auth.users) ─────────────────
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  postcode text,
  country text default 'United Kingdom',
  marketing_emails boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── CATEGORIES ──────────────────────────────────────────────
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;
create policy "Anyone can view categories" on categories for select using (true);
create policy "Admin only insert" on categories for insert using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- Seed categories
insert into public.categories (name, slug, description, sort_order) values
  ('Bridal Wear', 'bridal', 'Stunning bridal lehengas, sharara suits and dupatta sets', 1),
  ('Casual Wear', 'casual', 'Everyday lawn, cotton and chiffon suits', 2),
  ('Formal Wear', 'formal', 'Elegant party and occasion wear', 3),
  ('Accessories', 'accessories', 'Jewellery, dupattas and bridal accessories', 4);

-- ─── PRODUCTS ────────────────────────────────────────────────
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories(id),
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null,
  compare_price numeric(10,2),
  images text[] default '{}',
  colours text[] default '{}',
  sizes text[] default '{}',
  stock_quantity int default 0,
  is_featured boolean default false,
  is_active boolean default true,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;
create policy "Anyone can view active products" on products for select using (is_active = true);
create policy "Admin full access products" on products for all using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ─── PROMOTIONS ──────────────────────────────────────────────
create table public.promotions (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  type text check (type in ('percentage', 'fixed')) default 'percentage',
  value numeric(10,2) not null,
  min_order_amount numeric(10,2) default 0,
  max_uses int,
  uses_count int default 0,
  valid_from timestamptz default now(),
  valid_until timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.promotions enable row level security;
create policy "Anyone can read active promos" on promotions for select using (is_active = true);

-- ─── ORDERS ──────────────────────────────────────────────────
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  order_number text unique not null,
  status text check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')) default 'pending',
  payment_status text check (payment_status in ('unpaid','paid','refunded')) default 'unpaid',
  stripe_payment_intent_id text,
  subtotal numeric(10,2) not null,
  discount_amount numeric(10,2) default 0,
  shipping_amount numeric(10,2) default 0,
  total numeric(10,2) not null,
  promo_code text,
  -- Customer details (snapshot at order time)
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  -- Shipping address
  shipping_address_line1 text not null,
  shipping_address_line2 text,
  shipping_city text not null,
  shipping_postcode text not null,
  shipping_country text default 'United Kingdom',
  -- Admin notes
  notes text,
  tracking_number text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;
create policy "Users see own orders" on orders for select using (auth.uid() = user_id);
create policy "Admin sees all orders" on orders for all using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ─── ORDER ITEMS ─────────────────────────────────────────────
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  product_image text,
  price numeric(10,2) not null,
  quantity int not null,
  selected_colour text,
  selected_size text
);

alter table public.order_items enable row level security;
create policy "Users see own order items" on order_items for select
  using (order_id in (select id from orders where user_id = auth.uid()));
create policy "Admin sees all order items" on order_items for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ─── AUTO ORDER NUMBER ───────────────────────────────────────
create sequence order_number_seq start 1000;
create or replace function generate_order_number()
returns text as $$
begin
  return 'HC-' || lpad(nextval('order_number_seq')::text, 5, '0');
end;
$$ language plpgsql;

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at before update on products
  for each row execute procedure update_updated_at();
create trigger update_orders_updated_at before update on orders
  for each row execute procedure update_updated_at();
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at();

-- ─── ENQUIRIES (WhatsApp/contact form) ──────────────────────
create table public.enquiries (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text,
  phone text,
  message text not null,
  category text,
  status text default 'new' check (status in ('new','replied','closed')),
  created_at timestamptz default now()
);

alter table public.enquiries enable row level security;
create policy "Anyone can insert enquiry" on enquiries for insert with check (true);
create policy "Admin sees all enquiries" on enquiries for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
