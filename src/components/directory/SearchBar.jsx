import { RotateCcw, Search } from 'lucide-react'

export default function SearchBar({
  value,
  onChange,
  onReset,
  resetDisabled = false,
  placeholder = 'Search name, service, area...',
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#dfddd7] bg-white px-4 shadow-[0_4px_14px_rgba(31,41,55,0.07)]">
        <Search size={19} className="shrink-0 text-[#6f7680]" />
        <input
          value={value}
          onChange={e=>onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#172033] outline-none placeholder:text-[#a0a4aa]"
        />
      </label>

      <button
        type="button"
        onClick={onReset}
        disabled={resetDisabled}
        className={`flex h-12 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-[11px] font-black shadow-[0_4px_14px_rgba(31,41,55,0.05)] transition active:scale-[0.98] ${
          resetDisabled
            ? 'cursor-default border-[#e5e2dd] bg-[#f7f5f1] text-[#aaa7a1]'
            : 'border-[#f0c784] bg-[#fff7e9] text-[#b66d0a]'
        }`}
      >
        <RotateCcw size={15}/>
        Reset
      </button>
    </div>
  )
}
