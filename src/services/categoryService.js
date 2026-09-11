import { supabase } from '../lib/supabase'
export async function getCategories(){ const {data,error}=await supabase.from('categories').select('*').eq('is_active',true).order('sort_order'); if(error) throw error; return data||[] }
export async function getServiceTypes(categoryId){ const {data,error}=await supabase.from('service_types').select('*').eq('category_id',categoryId).eq('is_active',true).order('sort_order'); if(error) throw error; return data||[] }
