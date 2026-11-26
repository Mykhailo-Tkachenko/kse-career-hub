import { supabase } from './supabase'
import type { Application } from '../types'

const CV_BUCKET = 'cvs'
const MAX_CV_SIZE = 5 * 1024 * 1024

interface ApplicationRow {
  id: string
  listing_id: string
  applicant_email: string
  cv_path: string
  created_at: string
}

function toApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    listingId: row.listing_id,
    applicantEmail: row.applicant_email,
    cvPath: row.cv_path,
    createdAt: row.created_at,
  }
}

// Чи вже відгукнувся поточний користувач (RLS повертає лише його власні відгуки або відгуки на вакансії його компанії)
export async function hasApplied(listingId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('applications')
    .select('id')
    .eq('listing_id', listingId)
    .eq('applicant_id', userId)
    .maybeSingle()
  if (error) throw error
  return data !== null
}

export async function applyToListing(listingId: string, cv: File) {
  if (cv.type !== 'application/pdf') throw new Error('CV має бути у форматі PDF')
  if (cv.size > MAX_CV_SIZE) throw new Error('CV має бути не більше 5 МБ')

  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) throw new Error('Щоб відгукнутися, потрібно увійти')

  const cvPath = `${user.id}/${listingId}-${Date.now()}.pdf`
  const upload = await supabase.storage
    .from(CV_BUCKET)
    .upload(cvPath, cv, { contentType: 'application/pdf' })
  if (upload.error) throw upload.error

  const { error } = await supabase.from('applications').insert({
    listing_id: listingId,
    applicant_id: user.id,
    applicant_email: user.email,
    cv_path: cvPath,
  })
  if (error) {
    if (error.code === '23505') throw new Error('Ви вже відгукнулися на цю вакансію')
    throw error
  }
}

// Компанія, до якої прив'язаний акаунт (таблиця company_members), або null
export async function fetchMyCompany(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('company_members')
    .select('company')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data?.company ?? null
}

export async function fetchApplications(listingIds: string[]): Promise<Application[]> {
  if (listingIds.length === 0) return []
  const { data, error } = await supabase
    .from('applications')
    .select('id, listing_id, applicant_email, cv_path, created_at')
    .in('listing_id', listingIds)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as ApplicationRow[]).map(toApplication)
}

// Бакет приватний, тому CV відкриваємо через тимчасове посилання
export async function getCvUrl(cvPath: string): Promise<string> {
  const { data, error } = await supabase.storage.from(CV_BUCKET).createSignedUrl(cvPath, 60)
  if (error) throw error
  return data.signedUrl
}
