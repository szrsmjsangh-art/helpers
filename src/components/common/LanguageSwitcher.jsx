import { useLanguage } from '../../hooks/useLanguage'
export default function LanguageSwitcher(){ const {language,setLanguage}=useLanguage(); return <select value={language} onChange={e=>setLanguage(e.target.value)} className="rounded-lg border px-2 py-1 text-sm"><option value="en">EN</option><option value="gu">ગુ</option><option value="hi">हि</option></select> }
