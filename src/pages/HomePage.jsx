import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Sparkles } from 'lucide-react'
import SearchBar from '../components/directory/SearchBar'
import CategoryScroller from '../components/directory/CategoryScroller'
import ServiceTypeChip from '../components/directory/ServiceTypeChip'
import HelperCard from '../components/directory/HelperCard'
import HelperDetailsModal from '../components/directory/HelperDetailsModal'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { useCategories } from '../hooks/useCategories'
import { useLanguage } from '../hooks/useLanguage'
import { getAllHelpers } from '../services/directoryService'
import { getServiceTypes } from '../services/categoryService'

export default function HomePage(){
  const [search,setSearch]=useState('')
  const [allHelpers,setAllHelpers]=useState([])
  const [selected,setSelected]=useState(null)
  const [serviceNames,setServiceNames]=useState({})
  const [selectedCategoryId,setSelectedCategoryId]=useState('')
  const [selectedServices,setSelectedServices]=useState([])
  const [servicesLoading,setServicesLoading]=useState(false)
  const [selectedServiceId,setSelectedServiceId]=useState('')
  const [helpersLoading,setHelpersLoading]=useState(true)

  const {categories,loading,error}=useCategories()
  const {language}=useLanguage()
  const getLabel=(c)=>c?.[`name_${language}`] || c?.name_en || ''

  // Load every visible helper once. This allows an unfiltered search across the whole directory.
  useEffect(()=>{
    let ignore=false
    setHelpersLoading(true)
    getAllHelpers()
      .then(rows=>{ if(!ignore) setAllHelpers(rows) })
      .catch(console.error)
      .finally(()=>{ if(!ignore) setHelpersLoading(false) })
    return ()=>{ ignore=true }
  },[])

  // Load service names for every category so global search can match service text too.
  useEffect(()=>{
    if(!categories.length) return
    let ignore=false

    Promise.all(categories.map(c=>getServiceTypes(c.id).catch(()=>[])))
      .then(lists=>{
        if(ignore) return
        const next={}
        lists.flat().forEach(service=>{
          next[service.id]=service[`name_${language}`] || service.name_en || ''
        })
        setServiceNames(next)
      })

    return ()=>{ ignore=true }
  },[categories,language])

  // Only show service chips after the user explicitly selects a category.
  useEffect(()=>{
    if(!selectedCategoryId){
      setSelectedServices([])
      setSelectedServiceId('')
      return
    }

    let ignore=false
    setSelectedServiceId('')
    setServicesLoading(true)

    getServiceTypes(selectedCategoryId)
      .then(rows=>{
        if(ignore) return
        setSelectedServices(rows)
        setServiceNames(prev=>{
          const next={...prev}
          rows.forEach(service=>{
            next[service.id]=service[`name_${language}`] || service.name_en || ''
          })
          return next
        })
      })
      .catch(err=>{
        console.error(err)
        if(!ignore) setSelectedServices([])
      })
      .finally(()=>{ if(!ignore) setServicesLoading(false) })

    return ()=>{ ignore=true }
  },[selectedCategoryId,language])

  const shownCategories=useMemo(()=>categories,[categories])
  const selectedCategory=categories.find(c=>c.id===selectedCategoryId)
  const modalCategory=categories.find(c=>c.id===selected?.category_id)
  const selectedService=selectedServices.find(s=>s.id===selectedServiceId)

  const searchTokens=useMemo(
    ()=>search.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [search]
  )

  // AND-token search: "sanjay plum" can match name=Sanjay + service=Plumber.
  // Partial words also work because each token is matched with includes().
  const filteredHelpers=useMemo(()=>{
    return allHelpers.filter(helper=>{
      if(selectedCategoryId && helper.category_id!==selectedCategoryId) return false
      if(selectedServiceId && helper.service_type_id!==selectedServiceId) return false

      if(!searchTokens.length) return true

      const serviceName=serviceNames[helper.service_type_id] || ''
      const haystack=[
        helper.name,
        serviceName,
        helper.area,
        helper.description,
        helper.mobile,
        helper.whatsapp,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchTokens.every(token=>haystack.includes(token))
    })
  },[
    allHelpers,
    selectedCategoryId,
    selectedServiceId,
    searchTokens,
    serviceNames,
  ])

  const recentHelpers=useMemo(()=>allHelpers.slice(0,4),[allHelpers])
  const hasActiveFilter=Boolean(search.trim() || selectedCategoryId || selectedServiceId)

  const selectCategory=(categoryId)=>{
    setSelectedCategoryId(prev=>prev===categoryId ? '' : categoryId)
  }

  const selectService=(serviceTypeId)=>{
    setSelectedServiceId(prev=>prev===serviceTypeId ? '' : serviceTypeId)
  }

  const resetFilters=()=>{
    setSearch('')
    setSelectedCategoryId('')
    setSelectedServiceId('')
    setSelectedServices([])
  }

  const resultTitle=()=>{
    if(selectedService){
      return `${selectedService[`name_${language}`] || selectedService.name_en} in Bharuch`
    }
    if(selectedCategory){
      return `${getLabel(selectedCategory)} in Bharuch`
    }
    if(search.trim()) return 'Search Results'
    return 'Helpers'
  }

  return <div>
    <section className="relative overflow-hidden border-b border-orange-100 bg-gradient-to-br from-[#f4a13c] via-[#f7c77f] to-[#7eb8b4] px-4 pb-5 pt-5">
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_25%),radial-gradient(circle_at_80%_70%,white_0,transparent_25%)]"/>
      <div className="relative min-h-[150px] rounded-[20px] border border-white/50 bg-black/10 p-5 shadow-inner backdrop-blur-[1px]">
        <div className="max-w-[250px] text-[27px] font-black italic leading-[1.12] text-white drop-shadow-sm">Find Trusted Helpers in Our Community</div>
        <div className="mt-3 text-[11px] font-semibold text-white/90">Bharuch · Find · Connect · Support</div>
      </div>
      <div className="relative -mt-5">
        <SearchBar
          value={search}
          onChange={setSearch}
          onReset={resetFilters}
          resetDisabled={!hasActiveFilter}
        />
      </div>
    </section>

    <div className="space-y-6 px-4 py-5">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-black text-[#202631]">Categories</h2>
        </div>
        {loading
          ? <Loader/>
          : <>
              <ErrorMessage message={error}/>
              <CategoryScroller
                categories={shownCategories}
                getLabel={getLabel}
                selectedCategoryId={selectedCategoryId}
                onSelect={selectCategory}
              />
            </>
        }
      </section>

      {selectedCategoryId && (
        <section>
          <div className="mb-3">
            <h2 className="text-[15px] font-black text-[#202631]">
              {selectedCategory ? getLabel(selectedCategory) : 'Services'}
            </h2>
            <p className="mt-0.5 text-[10px] text-[#858a91]">Swipe to see all services</p>
          </div>

          {servicesLoading ? (
            <div className="flex gap-2 overflow-hidden">
              {[1,2,3,4].map(i=><div key={i} className="h-9 w-24 shrink-0 animate-pulse rounded-xl bg-[#eeeae4]"/>) }
            </div>
          ) : selectedServices.length ? (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide">
              {selectedServices.map(service=>(
                <ServiceTypeChip
                  key={service.id}
                  active={service.id===selectedServiceId}
                  onClick={()=>selectService(service.id)}
                >
                  {service[`name_${language}`] || service.name_en}
                </ServiceTypeChip>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#ddd6cb] bg-white px-4 py-4 text-center text-[11px] text-[#858a91]">
              No services available in this category yet.
            </div>
          )}
        </section>
      )}

      {hasActiveFilter ? (
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              {(selectedCategory || selectedService) && (
                <div className="text-[10px] font-bold uppercase tracking-wide text-[#18864a]">
                  {selectedCategory ? getLabel(selectedCategory) : 'Bharuch Directory'}
                </div>
              )}
              <h2 className="mt-0.5 text-[16px] font-black text-[#202631]">{resultTitle()}</h2>
            </div>
            <span className="shrink-0 text-[10px] font-bold text-[#757b82]">
              {filteredHelpers.length} found
            </span>
          </div>

          {helpersLoading ? (
            <Loader/>
          ) : filteredHelpers.length ? (
            <div className="space-y-2.5">
              {filteredHelpers.map(helper=>(
                <HelperCard
                  key={helper.id}
                  helper={helper}
                  onClick={setSelected}
                  serviceName={serviceNames[helper.service_type_id]}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#ddd6cb] bg-white p-6 text-center text-xs text-[#83878c]">
              No matching helpers found. Try another name, service or area.
            </div>
          )}
        </section>
      ) : (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#e4961a]"/>
              <h2 className="text-[15px] font-black text-[#202631]">Recently Added</h2>
            </div>
            <span className="flex items-center text-[10px] font-bold text-[#178145]">
              Latest <ChevronRight size={13}/>
            </span>
          </div>

          {helpersLoading ? (
            <Loader/>
          ) : (
            <div className="space-y-2.5">
              {recentHelpers.map(helper=>(
                <HelperCard
                  key={helper.id}
                  helper={helper}
                  onClick={setSelected}
                  serviceName={serviceNames[helper.service_type_id]}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="rounded-[18px] bg-gradient-to-r from-[#fff2dc] to-[#eef8ef] p-4 text-center">
        <div className="text-sm font-black text-[#303640]">Your Contacts → Your Approval → Community Benefit</div>
        <div className="mt-1 text-[10px] text-[#737981]">Help others by sharing trusted local service contacts.</div>
      </section>
    </div>

    <HelperDetailsModal
      helper={selected}
      onClose={()=>setSelected(null)}
      serviceName={selected?serviceNames[selected.service_type_id]:''}
      categoryName={modalCategory?getLabel(modalCategory):''}
    />
  </div>
}
