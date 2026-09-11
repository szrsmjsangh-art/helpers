import CategoryCard from './CategoryCard'
export default function CategoryScroller({ categories, getLabel }) { return <div className="grid grid-cols-2 gap-3">{categories.map(c=><CategoryCard key={c.id} category={c} label={getLabel(c)} />)}</div> }
