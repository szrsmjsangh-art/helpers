import { NavLink } from 'react-router-dom'
import { Home, UserPlus, CircleHelp, UserRound } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/add-helper', label: 'Add Contact', icon: UserPlus },
  { to: '/about', label: 'About', icon: CircleHelp },
  { to: '/login', label: 'Login', icon: UserRound },
]

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e8e2d8] bg-white/95 backdrop-blur">
      <div className="mx-auto grid h-[66px] max-w-[480px] grid-cols-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${isActive ? 'text-[#0b8f45]' : 'text-[#777b82]'}`}
          >
            {({ isActive }) => (
              <>
                <span className={`flex h-7 w-8 items-center justify-center rounded-lg ${isActive ? 'bg-[#e9f8ee]' : ''}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.7 : 2} />
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
