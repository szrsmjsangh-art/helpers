
import { Menu, Languages } from 'lucide-react'
import LanguageSwitcher from '../common/LanguageSwitcher'
import InstallAppButton from '../common/InstallAppButton'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-orange-100 bg-[#fffdf8]/95 backdrop-blur">
      <div className="mx-auto flex h-[70px] w-full max-w-[480px] items-center gap-2 px-3">

        {/* Call2Local Logo */}
        <a href="/" className="shrink-0" aria-label="Call2Local Home">
          <img
            src="/call2local-symbol.png"
            alt="Call2Local"
            className="h-12 w-auto max-w-[100px] object-contain"
          />
        </a>

        {/* Brand name and tagline */}
        
<div className="min-w-0 flex-1">
  <div className="truncate text-[20px] font-extrabold leading-tight tracking-tight">
    <span className="text-[#F7941D]">call</span>
    <span className="text-[#174F7C]">2</span>
    <span className="text-[#F7941D]">local.in</span>
  </div>

  <div className="mt-0.5 text-[10px] font-medium leading-tight tracking-wide text-[#334155]">
    Connect Locally. Easily.
  </div>
</div>

        <InstallAppButton />

        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#172033] hover:bg-orange-50"
          aria-label="Change language"
        >
          <Languages size={19} />
        </button>

        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#172033] hover:bg-orange-50"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  )
}
