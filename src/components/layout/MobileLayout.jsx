import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'

export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-[#f4f6f8] pb-[78px]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#fffdf9] shadow-[0_0_50px_rgba(31,41,55,0.08)]">
        <Header />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
