import { Link } from 'react-router-dom'
export default function CategoryCard({ category, label }) { return <Link to={`/category/${category.id}`} className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm"><div className="font-semibold text-gray-800">{label}</div></Link> }
