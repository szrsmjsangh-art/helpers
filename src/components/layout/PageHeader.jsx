export default function PageHeader({ title, subtitle }) {
  return <div className="mb-4"><h1 className="text-2xl font-bold">{title}</h1>{subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}</div>
}
