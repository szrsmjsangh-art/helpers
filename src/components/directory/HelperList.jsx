import HelperCard from './HelperCard'
import EmptyState from '../common/EmptyState'
export default function HelperList({ helpers, onSelect }) { if(!helpers.length) return <EmptyState message="No helpers found."/>; return <div className="space-y-3">{helpers.map(h=><HelperCard key={h.id} helper={h} onClick={onSelect}/>)}</div> }
