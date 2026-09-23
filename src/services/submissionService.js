import { supabase } from '../lib/supabase'

export async function submitHelper(form) {
  const { data, error } = await supabase.rpc('submit_directory_helper', {
    p_name: form.name,
    p_mobile: form.mobile,
    p_whatsapp: form.whatsapp || null,
    p_category_id: form.categoryId,
    p_service_type_id: form.serviceTypeId,
    p_area: form.area?.trim() || null,
    p_description: form.description || null,
    p_photo_url: form.photoUrl || null,
    p_submitted_name: form.submittedName || null,
  })

  if (error) throw error

  return data
}