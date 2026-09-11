import { ArrowLeft, Share2, Phone, MessageCircle, Bookmark, MapPin, Flag, ShieldCheck, UserRound } from 'lucide-react'

const wa = n => { const d=String(n||'').replace(/\D/g,''); return d.length===10?`91${d}`:d }

export default function HelperDetailsModal({ helper, onClose, serviceName, categoryName }) {
  if (!helper) return null
  const share = async()=>{
    const data={title:helper.name,text:`${helper.name}\n${serviceName||''}\n${helper.area||'Bharuch'}`}
    if(navigator.share) try{await navigator.share(data)}catch{}
  }
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#fffdf9]">
      <div className="mx-auto min-h-screen max-w-[480px] bg-white">
        <div className="relative h-[270px] overflow-hidden bg-gradient-to-br from-[#27475b] via-[#365f67] to-[#d69a55]">
          {helper.photo_url ? <img src={helper.photo_url} alt={helper.name} className="h-full w-full object-cover"/> : <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,.18),transparent_38%)] text-white/90"><UserRound size={86} strokeWidth={1.3}/><span className="mt-3 text-xs font-semibold">Community Service Provider</span></div>}
          <div className="absolute inset-x-0 top-0 flex justify-between p-4">
            <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur"><ArrowLeft size={22}/></button>
            <button onClick={share} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur"><Share2 size={20}/></button>
          </div>
        </div>
        <div className="relative -mt-5 rounded-t-[24px] bg-white px-5 pb-28 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2"><h1 className="text-[22px] font-black text-[#171d28]">{helper.name}</h1><span className="inline-flex items-center gap-1 rounded-full bg-[#e8f7eb] px-2 py-1 text-[10px] font-bold text-[#198a43]"><ShieldCheck size={12}/> Trusted</span></div>
              <p className="mt-1 text-sm font-semibold text-[#535b65]">{serviceName || 'Service Provider'}</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-[#666d76]"><MapPin size={14} className="text-[#e59b1a]"/>{helper.area || 'Bharuch'}{helper.city ? `, ${helper.city}`:''}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <a href={`tel:${helper.mobile}`} className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#16a34a] py-3 text-xs font-bold text-white"><Phone size={20}/>Call</a>
            <a href={`https://wa.me/${wa(helper.whatsapp||helper.mobile)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#22b65b] py-3 text-xs font-bold text-white"><MessageCircle size={20}/>WhatsApp</a>
            <button className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#1688d4] py-3 text-xs font-bold text-white"><Bookmark size={20}/>Save</button>
          </div>
          <section className="mt-6 border-t border-[#eee9e1] pt-5">
            <h2 className="text-sm font-black text-[#202631]">About</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#555d67]">{helper.description || `${serviceName || 'Local service'} available in Bharuch. Contact directly for service details and availability.`}</p>
          </section>
          <section className="mt-5 space-y-3 border-t border-[#eee9e1] pt-5 text-[12px]">
            <div className="grid grid-cols-[110px_1fr]"><span className="text-[#8a8f96]">Category</span><b>{categoryName || 'Community Services'}</b></div>
            <div className="grid grid-cols-[110px_1fr]"><span className="text-[#8a8f96]">Service Type</span><b>{serviceName || 'Service Provider'}</b></div>
            <div className="grid grid-cols-[110px_1fr]"><span className="text-[#8a8f96]">Area</span><b>{helper.area || 'Bharuch'}</b></div>
            <div className="grid grid-cols-[110px_1fr]"><span className="text-[#8a8f96]">Added by</span><b>{helper.first_submitted_name || 'Community Submitted'}</b></div>
          </section>
          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8f8ea] py-3 text-sm font-bold text-[#16783d]"><Flag size={17}/>Report / Suggest Update</button>
        </div>
      </div>
    </div>
  )
}
