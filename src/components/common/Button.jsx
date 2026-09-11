export default function Button({ children, className = '', ...props }) {
  return <button className={`rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white disabled:opacity-50 ${className}`} {...props}>{children}</button>
}
