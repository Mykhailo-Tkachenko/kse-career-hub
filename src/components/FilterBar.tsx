interface FilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  category: string
  onCategoryChange: (v: string) => void
  categories: string[]
  type: string
  onTypeChange: (v: string) => void
}

export default function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  type,
  onTypeChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Пошук за назвою або компанією..."
        className="flex-1 min-w-[220px] border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">Усі категорії</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">Усі типи</option>
        <option value="internship">Стажування</option>
        <option value="part-time">Часткова зайнятість</option>
        <option value="full-time">Повна зайнятість</option>
      </select>
    </div>
  )
}
