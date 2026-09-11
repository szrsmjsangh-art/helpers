import { House, CalendarDays, HeartPulse, CarFront, Grid2X2 } from 'lucide-react'

const config = [
  { icon: House, bg: '#fff0df', fg: '#f28a16' },
  { icon: CalendarDays, bg: '#ffe7e1', fg: '#ef5b4c' },
  { icon: HeartPulse, bg: '#e4f0ff', fg: '#2f77d8' },
  { icon: CarFront, bg: '#e7f5df', fg: '#4da13e' },
  { icon: Grid2X2, bg: '#e1f5e9', fg: '#16884d' },
]

export default function CategoryCard({ category, label, index = 0, active = false, onClick }) {
  const c = config[index % config.length]
  const Icon = c.icon

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="group flex min-w-[64px] flex-1 flex-col items-center text-center"
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-[14px] transition group-active:scale-95 ${
          active ? 'ring-2 ring-[#198b4b] ring-offset-2 shadow-md' : 'shadow-sm'
        }`}
        style={{ background: c.bg, color: c.fg }}
      >
        <Icon size={22} strokeWidth={2.4}/>
      </div>

      <div className={`mt-2 line-clamp-2 text-[10px] font-bold leading-[12px] ${
        active ? 'text-[#14753f]' : 'text-[#343943]'
      }`}>
        {label}
      </div>
    </button>
  )
}
