-- =============================================================================
-- BATCH RPC: submit_directory_helpers
-- Run in Supabase → SQL Editor (project: marubharuch@gmail.com account)
--
-- Does NOT replace submit_directory_helper (single). It calls the existing
-- function for each row so your current insert / submission logic stays the same.
-- =============================================================================

create or replace function public.submit_directory_helpers(p_contacts jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  v_saved int := 0;
  v_failed int := 0;
  v_saved_rows jsonb := '[]'::jsonb;
  v_failed_rows jsonb := '[]'::jsonb;
  v_err text;
begin
  if p_contacts is null or jsonb_typeof(p_contacts) <> 'array' then
    raise exception 'p_contacts must be a JSON array';
  end if;

  if jsonb_array_length(p_contacts) > 50 then
    raise exception 'Maximum 50 contacts per batch call. Send multiple smaller batches from the app.';
  end if;

  for item in select * from jsonb_array_elements(p_contacts)
  loop
    begin
      perform public.submit_directory_helper(
        p_name := coalesce(item->>'name', ''),
        p_mobile := coalesce(item->>'mobile', ''),
        p_whatsapp := nullif(trim(coalesce(item->>'whatsapp', '')), ''),
        p_category_id := nullif(trim(coalesce(item->>'category_id', '')), '')::uuid,
        p_service_type_id := nullif(trim(coalesce(item->>'service_type_id', '')), '')::uuid,
        p_area := nullif(trim(coalesce(item->>'area', '')), ''),
        p_description := nullif(trim(coalesce(item->>'description', '')), ''),
        p_photo_url := nullif(trim(coalesce(item->>'photo_url', '')), ''),
        p_submitted_name := nullif(trim(coalesce(item->>'submitted_name', '')), '')
      );

      v_saved := v_saved + 1;
      v_saved_rows := v_saved_rows || jsonb_build_array(
        jsonb_build_object('mobile', item->>'mobile')
      );
    exception
      when others then
        v_failed := v_failed + 1;
        get stacked diagnostics v_err = message_text;
        v_failed_rows := v_failed_rows || jsonb_build_array(
          jsonb_build_object(
            'mobile', item->>'mobile',
            'name', item->>'name',
            'error', v_err
          )
        );
    end;
  end loop;

  return jsonb_build_object(
    'success', v_saved > 0,
    'saved_count', v_saved,
    'failed_count', v_failed,
    'saved', v_saved_rows,
    'failed', v_failed_rows
  );
end;
$$;

revoke all on function public.submit_directory_helpers(jsonb) from public;

grant execute on function public.submit_directory_helpers(jsonb) to anon, authenticated;

-- Quick test (replace UUIDs with your Others / Other Service ids if needed):
/*
select public.submit_directory_helpers(
  '[
    {"name":"Batch Test 1","mobile":"9876543211","category_id":"26173088-ad58-46e9-96c3-31203514d723","service_type_id":"4eb9b024-1680-4c4e-a8bc-2982dd965d3d"},
    {"name":"Batch Test 2","mobile":"9876543212","category_id":"26173088-ad58-46e9-96c3-31203514d723","service_type_id":"4eb9b024-1680-4c4e-a8bc-2982dd965d3d"}
  ]'::jsonb
);
*/
