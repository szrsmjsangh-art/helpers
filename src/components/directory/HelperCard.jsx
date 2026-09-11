import { Phone, MessageCircle, MapPin, UserRound } from 'lucide-react'

const wa = n => {
  const d = String(n || '').replace(/\D/g,'')
  return d.length === 10 ? `91${d}` : d
}

export default function HelperCard({ helper, onClick, serviceName }) {
  return (
    <article onClick={()=>onClick?.(helper)} className="flex cursor-pointer items-center gap-3 rounded-[15px] border border-[#ece8df] bg-white p-3 shadow-[0_3px_12px_rgba(31,41,55,0.05)]">
      <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#edf1f4] text-[#87909b]">
        {helper.photo_url ? <img src={helper.photo_url} alt={helper.name} className="h-full w-full object-cover"/> : <UserRound size={26}/>}      
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[14px] font-extrabold text-[#172033]">{helper.name}</h3>
        <div className="mt-0.5 truncate text-[11px] font-medium text-[#68707b]">{serviceName || 'Community Helper'}</div>
        <div className="mt-1 flex items-center gap-1 truncate text-[10px] text-[#7d838c]"><MapPin size={11}/>{helper.area || 'Bharuch'}{helper.city && helper.city !== helper.area ? `, ${helper.city}` : ''}</div>
      </div>
      <div className="flex shrink-0 gap-2" onClick={e=>e.stopPropagation()}>
        <a href={`tel:${helper.mobile}`} className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#10a54a] text-white shadow-sm" aria-label="Call"><Phone size={17}/></a>
        <a href={`https://wa.me/${wa(helper.whatsapp || helper.mobile)}`} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#20b65a] text-white shadow-sm" aria-label="WhatsApp"><MessageCircle size={17}/></a>
      </div>
    </article>
  )
}
