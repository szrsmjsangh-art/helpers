import LanguageSwitcher from '../common/LanguageSwitcher'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-amber-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-3 py-3">
        <div>
          <div className="text-lg font-bold text-emerald-800">Community Directory</div>
          <div className="text-xs text-gray-500">Bharuch</div>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
