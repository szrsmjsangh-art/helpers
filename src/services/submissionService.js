import { supabase } from '../lib/supabase'
import { chunkArray } from '../utils/chunkArray'

/** Max rows per submit_directory_helpers RPC (see supabase/submit_directory_helpers.sql). */
export const BATCH_RPC_CHUNK_SIZE = 30

function toBatchRow(form) {
  return {
    name: form.name,
    mobile: form.mobile,
    whatsapp: form.whatsapp || null,
    category_id: form.categoryId || null,
    service_type_id: form.serviceTypeId || null,
    area: form.area?.trim() || null,
    description: form.description || null,
    photo_url: form.photoUrl || null,
    submitted_name: form.submittedName || null,
  }
}

export async function submitHelpersBatch(forms) {
  const { data, error } = await supabase.rpc('submit_directory_helpers', {
    p_contacts: forms.map(toBatchRow),
  })

  if (error) throw error

  return data
}

/** Chunked batch upload for large contact lists. */
export async function submitHelpersBatchChunked(
  forms,
  chunkSize = BATCH_RPC_CHUNK_SIZE,
  onProgress
) {
  const chunks = chunkArray(forms, chunkSize)
  let savedCount = 0
  let failedCount = 0
  const failed = []

  for (const chunk of chunks) {
    const result = await submitHelpersBatch(chunk)
    savedCount += result?.saved_count ?? 0
    failedCount += result?.failed_count ?? 0
    if (Array.isArray(result?.failed)) {
      failed.push(...result.failed)
    }
    onProgress?.(savedCount)
  }

  return { saved_count: savedCount, failed_count: failedCount, failed }
}

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