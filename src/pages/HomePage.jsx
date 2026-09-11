import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import SearchBar from '../components/directory/SearchBar'
import CategoryScroller from '../components/directory/CategoryScroller'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { useCategories } from '../hooks/useCategories'
import { useLanguage } from '../hooks/useLanguage'
export default function HomePage(){ const [search,setSearch]=useState(''); const {categories,loading,error}=useCategories(); const {language}=useLanguage(); const getLabel=(c)=>c[`name_${language}`] || c.name_en; return <div><PageHeader title="Find a Helper" subtitle="Community service directory for Bharuch"/><SearchBar value={search} onChange={setSearch}/><div className="mt-5">{loading?<Loader/>:<><ErrorMessage message={error}/><CategoryScroller categories={categories.filter(c=>getLabel(c).toLowerCase().includes(search.toLowerCase()) || !search)} getLabel={getLabel}/></>}</div></div> }
