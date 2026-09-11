import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, House, ChevronRight, Zap, Wrench, Hammer, Paintbrush, Snowflake, Search } from 'lucide-react'
import HelperList from '../components/directory/HelperList'
import HelperDetailsModal from '../components/directory/HelperDetailsModal'
import { getHelpersByCategory } from '../services/directoryService'
import { getCategories, getServiceTypes } from '../services/categoryService'

const icons=[Zap,Wrench,Hammer,Paintbrush,Snowflake,Search]
export default function CategoryPage(){
  const {categoryId}=useParams(); const navigate=useNavigate(); const [searchParams,setSearchParams]=useSearchParams()
  const [helpers,setHelpers]=useState([]); const [types,setTypes]=useState([]); const [categories,setCategories]=useState([]); const [selectedType,setSelectedType]=useState(searchParams.get('service') || ''); const [selected,setSelected]=useState(null)
  useEffect(()=>{getHelpersByCategory(categoryId).then(setHelpers).catch(console.error);getServiceTypes(categoryId).then(setTypes).catch(console.error);getCategories().then(setCategories).catch(console.error)},[categoryId])
  useEffect(()=>{ setSelectedType(searchParams.get('service') || '') },[searchParams])
  const cat=categories.find(c=>c.id===categoryId)
  const filtered=useMemo(()=>selectedType?helpers.filter(h=>h.service_type_id===selectedType):helpers,[helpers,selectedType])
  const serviceMap=Object.fromEntries(types.map(t=>[t.id,t.name_en]))
  return <div className="px-4 py-4">
    <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-r from-[#fff1dd] to-[#fffaf0] p-4">
      <div className="absolute bottom-0 right-0 text-[80px] opacity-[0.07]">🛕</div>
      <div className="relative flex items-center gap-3"><button onClick={()=>navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"><ArrowLeft size={18}/></button><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe4c8] text-[#f18a20]"><House size={25}/></div><div><h1 className="text-[20px] font-black text-[#1c2430]">{cat?.name_en || 'Services'}</h1><p className="text-[11px] font-semibold text-[#7b7e82]">{cat?.name_gu || 'Find trusted local service providers'}</p></div></div>
    </div>
    <div className="mt-4 space-y-2">
      {types.map((t,i)=>{const Icon=icons[i%icons.length]; const active=selectedType===t.id; return <button key={t.id} onClick={()=>{ const next=active?'':t.id; setSelectedType(next); next?setSearchParams({service:next}):setSearchParams({}) }} className={`flex w-full items-center gap-3 rounded-[14px] border p-3 text-left shadow-sm ${active?'border-[#8bcf9c] bg-[#edf9f0]':'border-[#ece8e1] bg-white'}`}><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2df] text-[#e88b20]"><Icon size={20}/></span><span className="min-w-0 flex-1"><b className="block truncate text-[13px] text-[#232934]">{t.name_en}</b><span className="text-[10px] text-[#8a8f96]">{t.name_gu || t.name_hi || ''}</span></span><span className="rounded-full bg-[#f4f5f6] px-2 py-1 text-[10px] font-bold text-[#6f757d]">{helpers.filter(h=>h.service_type_id===t.id).length}</span><ChevronRight size={17} className="text-[#9a9ea4]"/></button>})}
    </div>
    <div className="mt-6"><div className="mb-3 flex items-center justify-between"><h2 className="text-[15px] font-black text-[#222934]">{selectedType?serviceMap[selectedType]:'All Helpers'}</h2><span className="text-[10px] text-[#838890]">{filtered.length} results</span></div><HelperList helpers={filtered} onSelect={setSelected} serviceTypes={types}/></div>
    <HelperDetailsModal helper={selected} onClose={()=>setSelected(null)} serviceName={selected?serviceMap[selected.service_type_id]:''} categoryName={cat?.name_en}/>
  </div>
}
