import { useState } from 'react'
import type { ListingInput, ListingType } from '../types'
import { typeLabel } from '../lib/listings'

interface ListingFormProps {
  initial?: ListingInput
  submitLabel: string
  onSubmit: (input: ListingInput) => Promise<void>
}

const inputClass =
  'w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400'

export default function ListingForm({ initial, submitLabel, onSubmit }: ListingFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [type, setType] = useState<ListingType>(initial?.type ?? 'internship')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [remote, setRemote] = useState(initial?.remote ?? false)
  const [description, setDescription] = useState(initial?.description ?? '')
  const [requirements, setRequirements] = useState(initial?.requirements.join(', ') ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        type,
        category: category.trim(),
        location: remote && !location.trim() ? 'Віддалено' : location.trim(),
        remote,
        description: description.trim(),
        requirements: requirements
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
      })
    } catch (err) {
      setError((err as Error).message)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Назва позиції</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Наприклад, Marketing Intern"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Тип зайнятості</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ListingType)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {(Object.keys(typeLabel) as ListingType[]).map((t) => (
              <option key={t} value={t}>
                {typeLabel[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Категорія</label>
          <input
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Marketing, Data, ..."
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Локація</label>
        <input
          required={!remote}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Київ"
          className={inputClass}
        />
        <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={remote} onChange={(e) => setRemote(e.target.checked)} />
          Можна працювати віддалено
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Опис вакансії</label>
        <textarea
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Чим займатиметься студент, які інструменти використовує команда..."
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Вимоги (через кому)</label>
        <input
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Excel, SQL, англійська B2"
          className={inputClass}
        />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
      >
        {submitting ? 'Зберігаємо...' : submitLabel}
      </button>
    </form>
  )
}
