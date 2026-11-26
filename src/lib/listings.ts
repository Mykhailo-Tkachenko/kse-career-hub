import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { companies } from '../data/mockData'
import type { Listing, ListingInput, ListingType } from '../types'

export const typeLabel: Record<ListingType, string> = {
  internship: 'Стажування',
  'part-time': 'Часткова зайнятість',
  'full-time': 'Повна зайнятість',
}

// Рядок таблиці listings у Supabase (snake_case)
interface ListingRow {
  id: string
  title: string
  company: string
  company_logo?: string | null
  type: ListingType
  location: string
  remote: boolean
  category: string
  description: string
  requirements: string[] | null
  posted_at: string
  applicants: number
  // До міграції company_listings.sql колонки немає — вважаємо вакансію відкритою
  is_active?: boolean
}

function toListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    // У таблиці немає логотипа — беремо емодзі компанії з mockData
    companyLogo: row.company_logo ?? companies.find((c) => c.name === row.company)?.logo ?? '🏢',
    type: row.type,
    location: row.location,
    remote: row.remote,
    category: row.category,
    description: row.description,
    requirements: row.requirements ?? [],
    // posted_at — timestamptz, показуємо лише дату
    postedAt: row.posted_at.slice(0, 10),
    applicants: row.applicants,
    isActive: row.is_active ?? true,
  }
}

function toRow(input: ListingInput) {
  return {
    title: input.title,
    type: input.type,
    location: input.location,
    remote: input.remote,
    category: input.category,
    description: input.description,
    requirements: input.requirements,
  }
}

// Без company — публічний список (лише відкриті), з company — усі вакансії компанії
export async function fetchListings(filter?: { company?: string }): Promise<Listing[]> {
  let query = supabase.from('listings').select('*').order('posted_at', { ascending: false })
  if (filter?.company) query = query.eq('company', filter.company)
  const { data, error } = await query
  if (error) throw error
  const listings = (data as ListingRow[]).map(toListing)
  return filter?.company ? listings : listings.filter((l) => l.isActive)
}

export async function fetchListing(id: string): Promise<Listing | null> {
  const { data, error } = await supabase.from('listings').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? toListing(data as ListingRow) : null
}

// Права перевіряє RLS: змінювати можна лише вакансії своєї компанії (supabase/company_listings.sql)
export async function createListing(company: string, input: ListingInput): Promise<string> {
  const { data: auth } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('listings')
    .insert({ ...toRow(input), company, created_by: auth.user?.id, applicants: 0 })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

// Якщо RLS не пустив, Supabase не повертає помилку, а просто не змінює рядок — перевіряємо це
function ensureChanged(rows: unknown[] | null) {
  if (!rows || rows.length === 0) throw new Error('Немає доступу до цієї вакансії')
}

export async function updateListing(id: string, input: ListingInput) {
  const { data, error } = await supabase.from('listings').update(toRow(input)).eq('id', id).select('id')
  if (error) throw error
  ensureChanged(data)
}

export async function setListingActive(id: string, isActive: boolean) {
  const { data, error } = await supabase
    .from('listings')
    .update({ is_active: isActive })
    .eq('id', id)
    .select('id')
  if (error) throw error
  ensureChanged(data)
}

export async function deleteListing(id: string) {
  const { data, error } = await supabase.from('listings').delete().eq('id', id).select('id')
  if (error) throw error
  ensureChanged(data)
}

interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  error: string | null
}

// Простий хук для завантаження даних; deps — коли перезапитувати
export function useQuery<T>(
  load: () => Promise<T>,
  deps: unknown[],
): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, loading: true, error: null })
  const [version, setVersion] = useState(0)
  const reload = useCallback(() => setVersion((v) => v + 1), [])

  // eslint-disable-next-line react-hooks/exhaustive-deps -- deps передає викликач
  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    load()
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((e: Error) => !cancelled && setState({ data: undefined, loading: false, error: e.message }))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version])

  return { ...state, reload }
}
