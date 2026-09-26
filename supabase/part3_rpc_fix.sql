-- Run this in SQL Editor if PART 3 failed with 42P13 (return type change).
-- Step 1: see all overloads (optional)
select p.oid::regprocedure as signature
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'submit_directory_helper';

-- Step 2: drop existing (signature from Supabase error hint)
drop function if exists public.submit_directory_helper(
  text, text, text, uuid, uuid, text, text, text, text
);

-- Step 3: paste PART 3 from verify_and_setup.sql from "create function" through GRANT,
--         OR run the full PART 3 block from verify_and_setup.sql again.
