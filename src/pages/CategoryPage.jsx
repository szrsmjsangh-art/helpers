import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import SearchBar from '../components/directory/SearchBar'
import HelperList from '../components/directory/HelperList'
import HelperDetailsModal from '../components/directory/HelperDetailsModal'
import { getHelpersByCategory } from '../services/directoryService'
export default function CategoryPage(){ const {categoryId}=useParams(); const [helpers,setHelpers]=useState([]); const [search,setSearch]=useState(''); const [selected,setSelected]=useState(null); useEffect(()=>{getHelpersByCategory(categoryId).then(setHelpers).catch(console.error)},[categoryId]); const filtered=useMemo(()=>helpers.filter(h=>`${h.name} ${h.area} ${h.description||''}`.toLowerCase().includes(search.toLowerCase())),[helpers,search]); return <div><PageHeader title="Helpers"/><SearchBar value={search} onChange={setSearch}/><div className="mt-4"><HelperList helpers={filtered} onSelect={setSelected}/></div><HelperDetailsModal helper={selected} onClose={()=>setSelected(null)}/></div> }
