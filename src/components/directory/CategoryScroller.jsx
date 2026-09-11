import CategoryCard from './CategoryCard'

export default function CategoryScroller({
  categories,
  getLabel,
  selectedCategoryId,
  onSelect,
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide">
      {categories.map((category,index)=>(
        <CategoryCard
          key={category.id}
          category={category}
          label={getLabel(category)}
          index={index}
          active={category.id===selectedCategoryId}
          onClick={()=>onSelect?.(category.id)}
        />
      ))}
    </div>
  )
}
