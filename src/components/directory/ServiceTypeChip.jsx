export default function ServiceTypeChip({
  active=false,
  children,
  className='',
  ...props
}) {
  return (
    <button
      type="button"
      className={`shrink-0 whitespace-nowrap rounded-xl border px-4 py-2.5 text-[11px] font-bold shadow-sm transition active:scale-[0.98] ${
        active
          ? 'border-[#16884d] bg-[#16884d] text-white'
          : 'border-[#e7e2d9] bg-white text-[#454c56]'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
