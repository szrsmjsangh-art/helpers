import { ContactRound } from 'lucide-react'
export default function ContactPicker({ onPick }) {
  const supported = typeof navigator !== 'undefined' && !!navigator.contacts?.select
  const pick=async()=>{ if(!supported) return; const contacts=await navigator.contacts.select(['name','tel'],{multiple:true}); onPick?.(contacts) }
  return <button type="button" onClick={pick} disabled={!supported} className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#0c9b45] px-4 py-3.5 text-sm font-bold text-white shadow-[0_5px_14px_rgba(15,150,70,.2)] disabled:bg-[#9ca3a8] disabled:shadow-none"><ContactRound size={20}/>{supported ? 'Select from Contacts' : 'Select from Contacts (mobile browser)'}</button>
}
