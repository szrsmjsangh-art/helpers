import { useEffect, useState } from 'react'
import { getHelpersByCategory } from '../services/directoryService'
export function useHelpers(categoryId){ const [helpers,setHelpers]=useState([]); useEffect(()=>{ if(categoryId) getHelpersByCategory(categoryId).then(setHelpers).catch(console.error)},[categoryId]); return helpers }
