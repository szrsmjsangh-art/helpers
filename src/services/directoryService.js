import { supabase } from '../lib/supabase'
export async function getHelpersByCategory(categoryId){ const {data,error}=await supabase.from('directory_people').select('*').eq('category_id',categoryId).neq('status','hidden').order('created_at',{ascending:false}); if(error) throw error; return data||[] }
