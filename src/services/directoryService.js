import { supabase } from '../lib/supabase'

export async function getAllHelpers() {
  const { data, error } = await supabase
    .from('directory_people')
    .select('*')
    .neq('status', 'hidden')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getHelpersByCategory(categoryId) {
  const { data, error } = await supabase
    .from('directory_people')
    .select('*')
    .eq('category_id', categoryId)
    .neq('status', 'hidden')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getRecentHelpers(limit = 6) {
  const { data, error } = await supabase
    .from('directory_people')
    .select('*')
    .neq('status', 'hidden')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}
