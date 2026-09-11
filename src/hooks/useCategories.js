import { useEffect, useState } from 'react'
import { getCategories } from '../services/categoryService'
export function useCategories(){ const [categories,setCategories]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); useEffect(()=>{getCategories().then(setCategories).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[]); return {categories,loading,error} }
