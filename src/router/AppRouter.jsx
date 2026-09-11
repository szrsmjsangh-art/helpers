import { Route, Routes } from 'react-router-dom'
import MobileLayout from '../components/layout/MobileLayout'
import HomePage from '../pages/HomePage'
import CategoryPage from '../pages/CategoryPage'
import AddHelperPage from '../pages/AddHelperPage'
import LoginPage from '../pages/LoginPage'
import AboutPage from '../pages/AboutPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MobileLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/add-helper" element={<AddHelperPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
