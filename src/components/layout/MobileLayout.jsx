import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'

export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-amber-50 pb-20">
      <Header />
      <main className="mx-auto w-full max-w-3xl px-3 py-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
