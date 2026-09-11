import { useEffect, useState } from 'react'
import { getServiceTypes } from '../services/categoryService'
export function useServiceTypes(categoryId){ const [serviceTypes,setServiceTypes]=useState([]); useEffect(()=>{ if(categoryId) getServiceTypes(categoryId).then(setServiceTypes).catch(console.error); else setServiceTypes([])},[categoryId]); return serviceTypes }
