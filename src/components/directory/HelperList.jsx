import HelperCard from './HelperCard'
export default function HelperList({ helpers, onSelect, serviceTypes = [] }) {
  const map = Object.fromEntries(serviceTypes.map(s=>[s.id,s.name_en]))
  return <div className="space-y-2.5">{helpers.map(h=><HelperCard key={h.id} helper={h} onClick={onSelect} serviceName={map[h.service_type_id]}/>)}</div>
}
