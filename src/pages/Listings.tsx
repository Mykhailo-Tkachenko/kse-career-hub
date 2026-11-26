import { useMemo, useState } from 'react'
import { fetchListings, useQuery } from '../lib/listings'
import ListingCard from '../components/ListingCard'
import FilterBar from '../components/FilterBar'

export default function Listings() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const { data: listings = [], loading, error } = useQuery(() => fetchListings(), [])

  const categories = useMemo(() => Array.from(new Set(listings.map((l) => l.category))), [listings])

  const filtered = listings.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !category || l.category === category
    const matchesType = !type || l.type === type
    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Вакансії та стажування</h1>
      <p className="text-slate-500 mb-6">
        {loading ? 'Завантаження...' : `Знайдено ${filtered.length} пропозицій`}
      </p>
      {error && (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Не вдалося завантажити вакансії: {error}
        </p>
      )}

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        type={type}
        onTypeChange={setType}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-slate-500 col-span-2 text-center py-10">
            Нічого не знайдено за цим запитом.
          </p>
        )}
      </div>
    </div>
  )
}
