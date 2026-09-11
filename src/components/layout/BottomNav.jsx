import { NavLink } from 'react-router-dom'

const links = [
  ['/', 'Home'],
  ['/add-helper', 'Add Helper'],
  ['/login', 'Login'],
  ['/about', 'About'],
]

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white">
      <div className="mx-auto grid max-w-3xl grid-cols-4">
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `px-2 py-3 text-center text-xs ${isActive ? 'font-semibold text-emerald-700' : 'text-gray-500'}`}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
