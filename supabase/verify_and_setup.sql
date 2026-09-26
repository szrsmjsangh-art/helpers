-- =============================================================================
-- Maru Bharuch — Supabase verify + setup (run in SQL Editor)
-- App expects: categories, service_types, directory_people, RPC submit_directory_helper
-- Run sections in order. If a step fails, read the error — your schema may differ.
-- =============================================================================


-- =============================================================================
-- PART 1: VERIFY (read-only) — run first, save results
-- =============================================================================

-- 1.1 Tables exist?
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('categories', 'service_types', 'directory_people')
order by 1;

-- 1.2 Column list (compare with app)
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('categories', 'service_types', 'directory_people')
order by table_name, ordinal_position;

-- 1.3 Fallback rows for contact import (must return 1 row)
select c.id as others_category_id,
       c.name_en as category,
       st.id as other_service_type_id,
       st.name_en as service
from categories c
join service_types st on st.category_id = c.id
where lower(trim(c.name_en)) = 'others'
  and lower(trim(st.name_en)) = 'other service'
  and c.is_active is true
  and st.is_active is true;

-- 1.4 RPC exists?
select p.proname, pg_get_function_identity_arguments(p.oid) as args
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'submit_directory_helper';

-- 1.5 RPC source (if exists)
select pg_get_functiondef(p.oid)
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'submit_directory_helper';

-- 1.6 RLS policies
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('categories', 'service_types', 'directory_people')
order by tablename, policyname;


-- =============================================================================
-- PART 2: SEED — Others + Other Service (safe if missing)
-- Names must match src/utils/helperCategoryMatcher.js
-- =============================================================================

insert into public.categories (name_en, name_gu, name_hi, is_active, sort_order)
select
  'Others',
  'અન્ય',
  'अन्य',
  true,
  9999
where not exists (
  select 1 from public.categories
  where lower(trim(name_en)) = 'others'
);

insert into public.service_types (category_id, name_en, name_gu, name_hi, is_active, sort_order)
select
  c.id,
  'Other Service',
  'અન્ય સેવા',
  'अन्य सेवा',
  true,
  9999
from public.categories c
where lower(trim(c.name_en)) = 'others'
  and not exists (
    select 1
    from public.service_types st
    where lower(trim(st.name_en)) = 'other service'
      and st.category_id = c.id
  );

-- Re-check fallback IDs (copy these UUIDs if needed)
select c.id as others_category_id,
       st.id as other_service_type_id
from public.categories c
join public.service_types st on st.category_id = c.id
where lower(trim(c.name_en)) = 'others'
  and lower(trim(st.name_en)) = 'other service';


-- =============================================================================
-- PART 3: RPC — submit_directory_helper
-- Creates function used by the React app.
-- If you see 42P13 "cannot change return type", DROP old version first (below).
-- Adjust column names if PART 1.2 shows different names on directory_people.
-- =============================================================================

-- Old RPC may return void/jsonb/etc. — must drop before changing return type.
drop function if exists public.submit_directory_helper(
  text, text, text, uuid, uuid, text, text, text, text
);

create function public.submit_directory_helper(
  p_name text,
  p_mobile text,
  p_whatsapp text default null,
  p_category_id uuid default null,
  p_service_type_id uuid default null,
  p_area text default null,
  p_description text default null,
  p_photo_url text default null,
  p_submitted_name text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_fallback_category_id uuid;
  v_fallback_service_type_id uuid;
begin
  if p_name is null or trim(p_name) = '' then
    raise exception 'Name is required';
  end if;

  if p_mobile is null or p_mobile !~ '^[6-9][0-9]{9}$' then
    raise exception 'Valid 10-digit Indian mobile number is required';
  end if;

  -- Resolve category / service (use params or fallback Others / Other Service)
  if p_category_id is not null and p_service_type_id is not null then
    v_fallback_category_id := p_category_id;
    v_fallback_service_type_id := p_service_type_id;
  else
    select c.id, st.id
    into v_fallback_category_id, v_fallback_service_type_id
    from categories c
    join service_types st on st.category_id = c.id
    where lower(trim(c.name_en)) = 'others'
      and lower(trim(st.name_en)) = 'other service'
      and c.is_active is true
      and st.is_active is true
    limit 1;

    if v_fallback_category_id is null then
      raise exception 'Missing category/service and fallback Others / Other Service not found in DB';
    end if;
  end if;

  insert into public.directory_people (
    name,
    mobile,
    whatsapp,
    category_id,
    service_type_id,
    area,
    city,
    description,
    photo_url,
    status,
    first_submitted_name
  )
  values (
    trim(p_name),
    p_mobile,
    nullif(trim(coalesce(p_whatsapp, '')), ''),
    v_fallback_category_id,
    v_fallback_service_type_id,
    nullif(trim(coalesce(p_area, '')), ''),
    'Bharuch',
    nullif(trim(coalesce(p_description, '')), ''),
    nullif(trim(coalesce(p_photo_url, '')), ''),
    'published',
    nullif(trim(coalesce(p_submitted_name, '')), '')
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_directory_helper(
  text, text, text, uuid, uuid, text, text, text, text
) from public;

grant execute on function public.submit_directory_helper(
  text, text, text, uuid, uuid, text, text, text, text
) to anon, authenticated;


-- =============================================================================
-- PART 4: RLS — public read + submit via RPC (SECURITY DEFINER)
-- Skip any policy that already exists (duplicate name error = OK, comment out).
-- =============================================================================

alter table public.categories enable row level security;
alter table public.service_types enable row level security;
alter table public.directory_people enable row level security;

drop policy if exists "Public read active categories" on public.categories;
create policy "Public read active categories"
  on public.categories for select
  to anon, authenticated
  using (is_active is true);

drop policy if exists "Public read active service types" on public.service_types;
create policy "Public read active service types"
  on public.service_types for select
  to anon, authenticated
  using (is_active is true);

drop policy if exists "Public read visible helpers" on public.directory_people;
create policy "Public read visible helpers"
  on public.directory_people for select
  to anon, authenticated
  using (status is distinct from 'hidden');


-- =============================================================================
-- PART 5: TEST RPC (optional — uses fallback IDs from DB)
-- Change mobile if this number already exists and you have a UNIQUE on mobile.
-- =============================================================================

/*
select public.submit_directory_helper(
  p_name := 'SQL Test Helper',
  p_mobile := '9123456789',
  p_whatsapp := null,
  p_category_id := (
    select id from categories where lower(trim(name_en)) = 'others' limit 1
  ),
  p_service_type_id := (
    select st.id
    from service_types st
    join categories c on c.id = st.category_id
    where lower(trim(c.name_en)) = 'others'
      and lower(trim(st.name_en)) = 'other service'
    limit 1
  ),
  p_area := null,
  p_description := 'Test from SQL Editor',
  p_photo_url := null,
  p_submitted_name := 'Admin'
);

-- Clean up test row:
-- delete from directory_people where mobile = '9123456789' and name = 'SQL Test Helper';
*/
