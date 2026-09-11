import { Menu, Languages } from 'lucide-react'
import LanguageSwitcher from '../common/LanguageSwitcher'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-orange-100 bg-[#fffdf8]/95 backdrop-blur">
      <div className="mx-auto flex h-[70px] w-full max-w-[480px] items-center gap-3 px-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-emerald-50 text-2xl shadow-sm">
          🛕
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[18px] font-black leading-tight text-[#172033]">Maru Bharuch</div>
          <div className="mt-0.5 text-[9px] font-semibold tracking-wide text-[#7b756d]">OUR PEOPLE · OUR COMMUNITY</div>
        </div>
        <div className="hidden sm:block"><LanguageSwitcher /></div>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl text-[#172033] hover:bg-orange-50" aria-label="Language">
          <Languages size={19} />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl text-[#172033] hover:bg-orange-50" aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>
    </header>
  )
}
